import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Calendar, User, Book, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

import {
    borrowBook,
    returnBook,
    getAllBorrowRecords,
    getOverdueBooks,
    filterSearch,
    getBooksByStatus,
    getTotalFineAmount
} from '../services/BorrowingService';
import { BorrowResponseDto, BorrowRequestDto } from '../dto/dto';

const Borrowing = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [isNewBorrowingOpen, setIsNewBorrowingOpen] = useState(false);
    const [borrowingRecords, setBorrowingRecords] = useState<BorrowResponseDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalFine, setTotalFine] = useState(0);

    // Form state for new borrowing
    const [newBorrowForm, setNewBorrowForm] = useState<Partial<BorrowRequestDto>>({
        bookId: undefined,
        userId: undefined,
        dueDate: ''
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([loadBorrowingData(), loadTotalFine()]);
        } catch (err) {
            setError('Failed to load initial borrowing data');
            console.error('Error loading initial data:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadBorrowingData = async () => {
        try {
            setLoading(true);
            setError(null);

            const records: BorrowResponseDto[] = await getAllBorrowRecords();
            const transformedRecords = records.map(transformRecord);

            setBorrowingRecords(transformedRecords);
        } catch (err) {
            setError('Failed to load borrowing data');
            console.error('Error loading borrowing data:', err);
            // Keep stale data in case of reload failure? Or clear it?
            // setBorrowingRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const loadTotalFine = async () => {
        try {
            const total = await getTotalFineAmount();
            setTotalFine(total);
        } catch (err) {
            console.error('Error loading total fine:', err);
            // Optionally set an error state for the fine amount
        }
    };

    const transformRecord = (record: BorrowResponseDto): BorrowResponseDto => ({
        ...record,
        status: mapApiStatusToUIStatus(record.status, record.dueDate),
        bookTitle: record.bookTitle.split(':')[0] || 'Unknown Book',
        memberName: `User ${record.userId}`,
        dueDate: record.dueDate,
        returnDate: record.returnDate || null,
    });

    const mapApiStatusToUIStatus = (apiStatus: string, dueDate: string): 'borrowed' | 'returned' | 'overdue' => {
        const status = apiStatus.toUpperCase();
        if (status === 'RETURNED') {
            return 'returned';
        }
        if (new Date(dueDate) < new Date()) {
            return 'overdue';
        }
        if (status === 'BORROWED' || status === 'ACTIVE') {
            return 'borrowed';
        }
        return 'borrowed'; // Default case
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            loadBorrowingData(); // Reload all data if search is cleared
            return;
        }
        try {
            setLoading(true);
            const results = await filterSearch(searchTerm);
            setBorrowingRecords(results.map(transformRecord));
        } catch (error) {
            console.error('Error fetching search results:', error);
            setError('Failed to perform search.');
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = useMemo(() => {
        if (activeTab === 'all') {
            return borrowingRecords;
        }
        return borrowingRecords.filter(r => r.status === activeTab);
    }, [activeTab, borrowingRecords]);

    const stats = useMemo(() => {
        const activeBorrowings = borrowingRecords.filter(r => r.status === 'borrowed' || r.status === 'overdue');
        const overdue = borrowingRecords.filter(r => r.status === 'overdue');
        const returnedToday = borrowingRecords.filter(r =>
            r.status === 'returned' &&
            r.returnDate && new Date(r.returnDate).toDateString() === new Date().toDateString()
        );

        return {
            activeBorrowings,
            overdue,
            returnedToday,
        };
    }, [borrowingRecords]);

    const handleNewBorrowing = async () => {
        try {
            if (!newBorrowForm.bookId || !newBorrowForm.userId || !newBorrowForm.dueDate) {
                setError('All fields are required');
                return;
            }

            const borrowRequest: BorrowRequestDto = {
                bookId: newBorrowForm.bookId,
                userId: newBorrowForm.userId,
                dueDate: newBorrowForm.dueDate
            };

            await borrowBook(borrowRequest);
            setIsNewBorrowingOpen(false);
            setNewBorrowForm({ bookId: undefined, userId: undefined, dueDate: '' });

            await loadInitialData(); // Reload all data

            setError(null);
            console.log('Book borrowed successfully');
        } catch (err) {
            console.error('Error creating borrowing:', err);
            setError('Failed to create borrowing record');
        }
    };

    const handleReturn = async (recordId: number) => {
        try {
            await returnBook(recordId);
            await loadInitialData(); // Reload all data
            setError(null);
            console.log('Book returned successfully');
        } catch (err) {
            console.error('Error returning book:', err);
            setError('Failed to return book');
        }
    };

    const getStatusColor = (status: BorrowResponseDto['status']) => {
        switch (status) {
            case 'borrowed': return 'bg-blue-100 text-blue-800';
            case 'returned': return 'bg-green-100 text-green-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: BorrowResponseDto['status']) => {
        switch (status) {
            case 'borrowed': return Book;
            case 'returned': return CheckCircle;
            case 'overdue': return AlertTriangle;
            default: return Book;
        }
    };

    const getDaysOverdue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today.getTime() - due.getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    };

    const statCards = [
        { title: 'Active Borrowings', value: stats.activeBorrowings.length, icon: Book, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { title: 'Overdue Books', value: stats.overdue.length, icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
        { title: 'Returned Today', value: stats.returnedToday.length, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
        { title: 'Total Fines', value: `$${totalFine.toFixed(2)}`, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    ];

    const tabs = [
        { id: 'all', label: 'All Records', count: borrowingRecords.length },
        { id: 'borrowed', label: 'Active Borrowings', count: stats.activeBorrowings.length },
        { id: 'overdue', label: 'Overdue', count: stats.overdue.length },
        { id: 'returned', label: 'Returned', count: borrowingRecords.filter(r => r.status === 'returned').length },
    ];

    if (loading && borrowingRecords.length === 0) { // Show full-page loader only on initial load
        return (
            <div className="p-6 flex items-center justify-center min-h-96">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading borrowing data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Borrowing & Returns</h1>
                    <p className="text-gray-600 mt-1">Manage book borrowings and returns</p>
                </div>

                <div className="relative inline-block">
                    <button
                        onClick={() => setIsNewBorrowingOpen(!isNewBorrowingOpen)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Borrowing
                    </button>

                    {isNewBorrowingOpen && (
                        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border p-6 z-10">
                            <h3 className="text-lg font-semibold mb-4">New Book Borrowing</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                    <input
                                        type="number"
                                        value={newBorrowForm?.userId || ''}
                                        onChange={(e) => setNewBorrowForm(prev => ({ ...prev, userId: parseInt(e.target.value) || undefined }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter user ID"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Book ID</label>
                                    <input
                                        type="number"
                                        value={newBorrowForm?.bookId || ''}
                                        onChange={(e) => setNewBorrowForm(prev => ({ ...prev, bookId: parseInt(e.target.value) || undefined }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter book ID"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={newBorrowForm?.dueDate || ''}
                                        onChange={(e) => setNewBorrowForm(prev => ({ ...prev, dueDate: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter Due Date"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setIsNewBorrowingOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleNewBorrowing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Create Borrowing
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                        <p className="text-red-800">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-600 hover:text-red-800"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-600">{stat.title}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tabs and Content */}
            <div className="bg-white rounded-lg shadow">
                <div className="border-b">
                    <div className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    if (tab.id === 'all' && searchTerm) {
                                        setSearchTerm('');
                                        loadBorrowingData();
                                    }
                                }}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="p-6 border-b">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by member, book title, book ID, or ISBN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Records List */}
                <div className="p-6">
                    {loading && <div className="text-center p-4">Loading...</div>}
                    {!loading && filteredRecords.length === 0 ? (
                        <div className="text-center py-12">
                            <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No borrowing records found for this filter.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredRecords.map((record) => {
                                const StatusIcon = getStatusIcon(record.status);
                                return (
                                    <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor(record.status)}`}>
                                                    <StatusIcon className={`w-6 h-6`} />
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="font-semibold text-gray-900">{record.bookTitle}</h3>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                                                            {record.status}
                                                        </span>
                                                        {record.status === 'overdue' && (
                                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                                                {getDaysOverdue(record.dueDate)} days overdue
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                                                        <div className="flex items-center space-x-1"><User className="w-3 h-3" /><span>{record.memberName}</span></div>
                                                        <div className="flex items-center space-x-1"><Book className="w-3 h-3" /><span>ID: {record.bookId}</span></div>
                                                        <div className="flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>Due: {new Date(record.dueDate).toLocaleDateString()}</span></div>
                                                        {record.returnDate && (
                                                            <div className="flex items-center space-x-1"><CheckCircle className="w-3 h-3" /><span>Returned: {new Date(record.returnDate).toLocaleDateString()}</span></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {record.status === 'borrowed' || record.status === 'overdue' ? (
                                                    <button
                                                        onClick={() => handleReturn(record.id)}
                                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Return Book</span>
                                                    </button>
                                                ) : (
                                                    <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center space-x-2">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>Returned</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Borrowing;