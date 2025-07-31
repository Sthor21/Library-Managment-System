export interface DashBoardResponseDTO {
    total_Books: number;
    active_Members: number;
    books_Borrowed: number;
    overdue_Books: number;
}

export type BorrowStatus = "BORROWED" | "RETURNED" | "OVERDUE"; // Enum as string

export interface RecentActivitiesResponseDTO {
    borrowID: number;
    borrowStatus: BorrowStatus;
    userName: string;
    bookTitle: string;
    time: string;
}

export interface PopularBooksDTO {
    title: string;
    borrows: number;
    rating: number;
}
export interface UserResponseDTO {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'ADMIN' | 'MEMBER' | 'LIBRARIAN'; 
    createdAt: string; // LocalDateTime is typically returned as ISO string from the backend
    updatedAt: string;
  }

  export interface UserRequestDto {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'ADMIN' | 'MEMBER' | 'LIBRARIAN';
  }
  
  export interface BorrowRequestDto {
    bookId: number; 
    userId: number; 
    dueDate: string;
  }

  export interface BorrowResponseDto {
    id: number;
    bookId: number;
    userId: number;
    bookTitle: string;
    borrowDate: string;
    dueDate: string; 
    returnDate: string | null;  
    status: string;
    fineAmount: string;
  }
  export enum Role {
    MEMBER = 'MEMBER',
    LIBRARIAN = 'LIBRARIAN',
    ADMIN = 'ADMIN'
}
  
  
  
