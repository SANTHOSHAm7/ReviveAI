import {
    Bell,
    Search,
    User,
    ChevronDown,
} from "lucide-react";

function Topbar() {
    return (
        <header className="topbar">

            <div className="search-box">

                <Search size={18} />

                <input
                    type="text"
                    placeholder="Search transactions, customers..."
                />

                <span className="search-shortcut">
                    ⌘ K
                </span>

            </div>


            <div className="topbar-right">

                <button className="icon-button">
                    <Bell size={19} />
                    <span className="notification-dot"></span>
                </button>


                <div className="profile">

                    <div className="profile-avatar">
                        <User size={18} />
                    </div>

                    <div className="profile-info">
                        <strong>Admin</strong>
                        <span>Business Account</span>
                    </div>

                    <ChevronDown size={16} />

                </div>

            </div>

        </header>
    );
}

export default Topbar;