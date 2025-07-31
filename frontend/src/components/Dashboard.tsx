import { useState, useEffect } from 'react';
import { Book, Users, TrendingUp, AlertCircle, Calendar, Award, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import DashboardService from '../services/DasboardService';
import { DashBoardResponseDTO, RecentActivitiesResponseDTO, PopularBooksDTO } from '../dto/dto';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [dashboardStats, setDashboardStats] = useState<DashBoardResponseDTO>({
    total_Books: 0,
    active_Members: 0,
    overdue_Books: 0,
    books_borrowed: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivitiesResponseDTO[]>([]);
  const [popularBooks, setPopularBooks] = useState<PopularBooksDTO[]>([]);

  // Load data from backend
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, activitiesData, booksData] = await Promise.all([
          DashboardService.getStatistics(),
          DashboardService.getRecentActivities(),
          DashboardService.getPopularBooks()
        ]);

        setDashboardStats(statsData);
        setRecentActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setPopularBooks(Array.isArray(booksData) ? booksData : []);
        
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Transform backend stats to frontend format
  const stats = [
    {
      title: 'Total Books',
      value: dashboardStats.total_Books.toLocaleString(),
      change: '+12%', // You might want to calculate this from historical data
      changeType: 'positive' as const,
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Members',
      value: dashboardStats.active_Members.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Books Borrowed',
      value: dashboardStats.books_borrowed.toLocaleString(),
      change: '+23%',
      changeType: 'positive' as const,
      icon: Calendar,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Overdue Books',
      value: dashboardStats.overdue_Books.toString(),
      change: '-15%',
      changeType: 'negative' as const,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  // Helper function to get activity icon and styling
  const getActivityDisplay = (action: string) => {
    switch (action.toLowerCase()) {
      case 'borrowed':
        return {
          icon: <Book className="w-5 h-5" />,
          bgColor: 'bg-blue-100 text-blue-600',
          status: 'borrowed'
        };
      case 'returned':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-100 text-green-600',
          status: 'returned'
        };
      case 'new_member':
        return {
          icon: <Users className="w-5 h-5" />,
          bgColor: 'bg-purple-100 text-purple-600',
          status: 'registered'
        };
      case 'overdue':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-red-100 text-red-600',
          status: 'overdue'
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-gray-100 text-gray-600',
          status: 'unknown'
        };
    }
  };

  // Calculate utilization rates
  const utilizationRate = dashboardStats.total_Books > 0 
    ? Math.round((dashboardStats.books_borrowed / dashboardStats.total_Books) * 100)
    : 0;

  const onTimeReturnRate = dashboardStats.books_borrowed > 0
    ? Math.round(((dashboardStats.books_borrowed - dashboardStats.overdue_Books) / dashboardStats.books_borrowed) * 100)
    : 100;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening at your library.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button size="sm">Quick Actions</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant={stat.changeType === 'positive' ? 'default' : 'destructive'} className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activities</span>
              <Button variant="ghost" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const display = getActivityDisplay(activity.action);
                return (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${display.bgColor}`}>
                      {display.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.userName}</p>
                      <p className="text-sm text-muted-foreground truncate">{activity.bookTitle}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">{display.status}</Badge>
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No recent activities found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Books</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularBooks && popularBooks.length > 0 ? (
              popularBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.borrows} borrows</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-medium">{book.rating}</span>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No popular books found
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Library Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Books Borrowed</span>
                <span>{utilizationRate}%</span>
              </div>
              <Progress value={utilizationRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {dashboardStats.books_borrowed.toLocaleString()} of {dashboardStats.total_Books.toLocaleString()} available books
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Member Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Active Members</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {dashboardStats.active_Members.toLocaleString()} active members
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Return Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>On-time Returns</span>
                <span>{onTimeReturnRate}%</span>
              </div>
              <Progress value={onTimeReturnRate} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Only {dashboardStats.overdue_Books} books overdue
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;