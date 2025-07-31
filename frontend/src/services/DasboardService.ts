import axios from "axios";
import { DashBoardResponseDTO, RecentActivitiesResponseDTO, PopularBooksDTO } from '../dto/dto';

const BASE_URL = "http://localhost:8082/dashboard";

class DashboardService {
  async getStatistics(): Promise<DashBoardResponseDTO> {
    const response = await axios.get<DashBoardResponseDTO>(`${BASE_URL}/statistic`);
    return response.data;
  }

  async getRecentActivities(): Promise<RecentActivitiesResponseDTO[]> {
    const response = await axios.get<RecentActivitiesResponseDTO[]>(`${BASE_URL}/recent`);
    return response.data;
  }

  async getPopularBooks(): Promise<PopularBooksDTO[]> {
    const response = await axios.get<PopularBooksDTO[]>(`${BASE_URL}/popular`);
    return response.data;
  }
}

export default new DashboardService;