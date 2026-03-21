import { api } from "./api";


export const createPost = async (ev, caption, files) => {
    try {
        ev.preventDefault();

        // handling error if the user did not sent the data
        if (files.length === 0) {
            return;
        }

        const formData = new FormData();

        formData.append("caption", caption || "");
        Array.from(files).forEach((file) => {
            formData.append("images", file);
        });

        const response = await api.post("/api/post/create-post", formData);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}