interface LoadingSpinnerProps {
  message?: string;
}



export default function LoadingSpinner({
    message = 'Loading...',
}: LoadingSpinnerProps) {
    return (
        <div className="loading-screen" role="status">
        <div className="spinner" />
        <p>{message}</p>
        </div>
    );
}