import axios, {AxiosError, AxiosInstance} from "axios";

interface Place {
  displayName?: string;
  formattedAddress?: string;
  priceLevel?: number;
  photos?: string[];
}

interface AutocompleteResult {
  predictions: string[];
}

export class GooglePlacesService {
  private api: AxiosInstance;

  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error("Google Places API Key is required.");
    }

    this.api = axios.create({
      baseURL: "https://places.googleapis.com/v1",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
    });
  }

  async searchPlaces(
    textQuery: string,
    fieldMask: string = "places.displayName,places.formattedAddress,places.priceLevel,places.photos"
  ): Promise<Place[]> {
    try {
      const response = await this.api.post<{ places: Place[] }>(
        "/places:searchText",
        { textQuery },
        { headers: { "X-Goog-FieldMask": fieldMask } }
      );
      return response.data.places || [];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getPlaceDetails(
    placeId: string,
    fieldMask: string = "places.displayName,places.formattedAddress,places.priceLevel,places.photos"
  ): Promise<Place | null> {
    try {
      const response = await this.api.get<Place>(`/places/${placeId}`, {
        headers: { "X-Goog-FieldMask": fieldMask },
      });
      return response.data || null;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async autocompletePlaces(
    input: string,
    fieldMask: string = "places.displayName,places.formattedAddress"
  ): Promise<AutocompleteResult> {
    try {
      const response = await this.api.post<AutocompleteResult>(
        "/places:autocomplete",
        { input },
        { headers: { "X-Goog-FieldMask": fieldMask } }
      );
      return response.data || { predictions: [] };
    } catch (error) {
      this.handleError(error);
      return { predictions: [] };
    }
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Error fetching data:", axiosError.message);
      if (axiosError.response) {
        console.error("Error data:", axiosError.response.data);
        console.error("Error status:", axiosError.response.status);
      } else if (axiosError.request) {
        console.error("Error request:", axiosError.request);
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

