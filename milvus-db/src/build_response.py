from typing import Optional

default_messages = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable"
}

def build_response(status_code: int, message: Optional[str] = None, data: Optional[dict] = None) -> dict:
    if message is None:
        message = default_messages.get(status_code, "Unknown Status Code")

    response = {
        "status_code": status_code,
        "message": message
    }

    if data is not None:
        response["data"] = data

    return response
