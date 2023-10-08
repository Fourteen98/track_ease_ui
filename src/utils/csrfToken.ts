export default function getCsrfToken(name = "csrftoken"): string {
    let csrfToken = "";
    console.log(document.cookie)
    console.log("Empty")
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === `${name}=`) {
                csrfToken = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return csrfToken;
}