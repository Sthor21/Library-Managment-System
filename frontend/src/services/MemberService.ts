import axios from 'axios';
import type { UserRequestDto, UserResponseDTO } from '../dto/dto';

// **IMPORTANT**: Adjust this URL to match your backend's address and port.
const API_URL = 'http://localhost:8082/users';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetches all members from the server.
 * Corresponds to: GET /users
 */
const getAllMembers = async (): Promise<UserResponseDTO[]> => {
    const response = await apiClient.get<UserResponseDTO[]>('');
    return response.data.slice(0, 10); // Limit to first 10 members for performance
};

/**
 * Fetches a single member by their ID.
 * Corresponds to: GET /users/{id}
 * @param id The numeric ID of the member to fetch.
 */
const getMemberById = async (id: number): Promise<UserResponseDTO> => {
    const response = await apiClient.get<UserResponseDTO>(`/${id}`);
    return response.data;
};

/**
 * Searches for members by name.
 * NOTE: This function fetches all users and then filters them on the client-side.
 * For a very large number of users, consider implementing a dedicated search endpoint on your backend.
 * @param name The name to search for in the first or last name.
 * @returns A promise that resolves to an array of matching members.
 */
const searchMembersByName = async (name: string): Promise<UserResponseDTO[]> => {
    // If the search query is empty, return first 10 members
    if (!name.trim()) {
        const all = await getAllMembers();
        return all.slice(0, 10);
    }
    
    const allMembers = await getAllMembers();
    const searchTerm = name.toLowerCase();
    
    const filtered = allMembers.filter(member =>
        member.firstName.toLowerCase().includes(searchTerm) ||
        member.lastName.toLowerCase().includes(searchTerm)
    );
    
    return filtered.slice(0, 10); // limit to 10 results
};



/**
 * Adds a new member to the system.
 * Corresponds to: POST /users
 * @param memberData The data for the new member.
 */
const addMember = async (memberData: UserRequestDto): Promise<UserResponseDTO> => {
    const response = await apiClient.post<UserResponseDTO>('', memberData);
    return response.data;
};

/**
 * Updates an existing member's information.
 * Corresponds to: PUT /users/{id}
 * @param id The ID of the member to update.
 * @param memberData The new data for the member.
 */
const updateMember = async (id: number, memberData: UserRequestDto): Promise<UserResponseDTO> => {
    const response = await apiClient.put<UserResponseDTO>(`/${id}`, memberData);
    return response.data;
};


const deleteMember = async (id: number): Promise<void> => {
    // The backend returns HttpStatus.NO_CONTENT, so we expect an empty response.
    await apiClient.delete(`/${id}`);
};


// Export all functions as a single service object for easy importing.
export const MemberService = {
    getAllMembers,
    getMemberById,
    searchMembersByName,
    addMember,
    updateMember,
    deleteMember,
};
