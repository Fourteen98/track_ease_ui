import ApiClient from "./apiClient";
class MapActions extends ApiClient {

    public static createParcel = async (payload: any, isUpdate = false) => {
        const api = new ApiClient();
        return !isUpdate
            ? api.post("track-ease/8064c6bfe8974f06bec6efc9b53247ce", payload)
            : api.put("track-ease/", payload);
    };

    public static getParcel = async (id: string) => {
        const api = new ApiClient();
        return api.get(`track-ease/${id}`);
    }
}

export default MapActions;