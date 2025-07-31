import axios from 'axios';
import {BorrowResponseDto,BorrowRequestDto} from '../dto/dto';


const BASE_URL = 'http://localhost:8082/borrows';

// 1. Borrow a book
export const borrowBook = async (data: BorrowRequestDto) => {
  const response = await axios.post<BorrowResponseDto>(`${BASE_URL}`, data);
  return response.data;
};

// 2. Return a book
export const returnBook = async (borrowRecordId: number) => {
  const response = await axios.put<BorrowResponseDto>(`${BASE_URL}/return/${borrowRecordId}`);
  return response.data;
};

// 3. Get all borrow records
export const getAllBorrowRecords = async () => {
  const response = await axios.get<BorrowResponseDto[]>(`${BASE_URL}`);
  return response.data;
};

// 4. Get borrow history for a user
export const getUserBorrowHistory = async (userId: number) => {
  const response = await axios.get<BorrowResponseDto[]>(`${BASE_URL}/user/${userId}`);
  return response.data;
};

// 5. Get overdue books
export const getOverdueBooks = async () => {
  const response = await axios.get<BorrowResponseDto[]>(`${BASE_URL}/overdue`);
  return response.data;
};

// 6. Get books by status (e.g. BORROWED, RETURNED, OVERDUE)
export const getBooksByStatus = async (borrowStatus: string) => {
  const response = await axios.get<BorrowResponseDto[]>(`${BASE_URL}/status/${borrowStatus}`);
  return response.data;
};

// 7. Get total fine amount (for all users)
export const getTotalFineAmount = async () => {
  const response = await axios.get<number>(`${BASE_URL}/totalFine`);
  return response.data;
};

export const filterSearch = async (keyword: string) => {
  const response = await axios.get<BorrowResponseDto[]>(`${BASE_URL}/search`, {
    params: { keyword }
  });
  return response.data;
};
