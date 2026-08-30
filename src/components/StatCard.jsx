function StatCard({
    title,
    value,
    change,
    description,
    icon: Icon,
}) {
    return (
        <div className="stat-card">

            <div className="stat-top">

                <div className="stat-icon">
                    <Icon size={21} />
                </div>

                <span className="stat-change">
                    {change}
                </span>

            </div>

            <div className="stat-content">

                <p>{title}</p>

                <h2>{value}</h2>

                <span>{description}</span>

            </div>

        </div>
    );
}

export default StatCard;