import { Settings as SettingsIcon } from "lucide-react";

function Settings() {
    return (
        <main className="dashboard">

            <div className="page-header">

                <div>

                    <span className="eyebrow">
                        CONFIGURATION
                    </span>

                    <h1>Settings</h1>

                    <p>
                        Manage your ReviveAI configuration.
                    </p>

                </div>

            </div>


            <div className="settings-card">

                <SettingsIcon size={32} />

                <h2>ReviveAI Settings</h2>

                <p>
                    Payment recovery and AI configuration
                    will appear here.
                </p>

            </div>

        </main>
    );
}

export default Settings;