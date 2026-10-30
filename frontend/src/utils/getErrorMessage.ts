import axios from 'axios';





export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (Array.isArray(message)) {
            return message.join(', ');
        }

        if (typeof message === 'string') {
            return message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    const fallbackMessage = 'Something went wrong. Please try again.'

    return fallbackMessage;
}