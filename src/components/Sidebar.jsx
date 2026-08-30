import {
    LayoutDashboard,
    CreditCard,
    BrainCircuit,
    BarChart3,
    Settings,
    Sparkles,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            {/* LOGO */}

            <div className="logo">

                <div className="logo-icon">
                    <Sparkles size={20} />
                </div>

                <div className="logo-text">
                    <h2>ReviveAI</h2>
                    <span>Revenue Intelligence</span>
                </div>

            </div>


            {/* NAVIGATION */}

            <nav className="sidebar-nav">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? "active" : ""}`
                    }
                >
                    <LayoutDashboard size={19} />
                    <span>Dashboard</span>
                </NavLink>


                <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? "active" : ""}`
                    }
                >
                    <CreditCard size={19} />
                    <span>Transactions</span>
                </NavLink>


                <NavLink
                    to="/recovery"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? "active" : ""}`
                    }
                >
                    <BrainCircuit size={19} />
                    <span>AI Recovery</span>
                </NavLink>


                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? "active" : ""}`
                    }
                >
                    <BarChart3 size={19} />
                    <span>Analytics</span>
                </NavLink>

            </nav>


            {/* BOTTOM */}

            <div className="sidebar-bottom">

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? "active" : ""}`
                    }
                >
                    <Settings size={19} />
                    <span>Settings</span>
                </NavLink>


                <div className="ai-status">

                    <div className="status-dot"></div>

                    <div>
                        <strong>AI Engine</strong>
                        <span>Online</span>
                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;