const StatusBadge = ({ status }) => {
    const styles = {
        confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
        pending: "bg-amber-100   text-amber-700   border-amber-200",
        cancelled: "bg-red-100     text-red-700     border-red-200",
        completed: "bg-blue-100    text-blue-700    border-blue-200",
    };
    return (
        <span
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[status] || styles.pending}`}
        >
            {status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending"}
        </span>
    );
};

export default StatusBadge;
