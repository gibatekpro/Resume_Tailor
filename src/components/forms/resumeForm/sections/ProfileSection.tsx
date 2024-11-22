import React from "react";
import {ResumeInfo} from "../../../../models/ResumeInfo";

interface ProfileSectionProps {
    resumeFormFormik: any; // Replace 'any' with the type from your resumeFormFormik configuration if available.
    inputFieldClassName: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ resumeFormFormik, inputFieldClassName }) => {

    return (
        <>
            <div className="grid grid-cols-2 gap-1 mb-1">
                <div>
                    <input
                        id="firstName"
                        name="profile.firstName"
                        type="text"
                        placeholder="First Name"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.profile.firstName}
                    />
                </div>
                <div>
                    <input
                        id="lastName"
                        name="profile.lastName"
                        type="text"
                        placeholder="Last Name"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.profile.lastName}
                    />
                </div>
            </div>

            <div className="mb-1">
                <input
                    id="profession"
                    name="profile.profession"
                    type="text"
                    placeholder="Profession"
                    className={inputFieldClassName}
                    onChange={resumeFormFormik.handleChange}
                    value={resumeFormFormik.values.profile.profession}
                />
            </div>

            <div className="mb-1">
                <textarea
                    id="summary"
                    name="profile.summary"
                    rows={3}
                    placeholder="Summary"
                    className={inputFieldClassName}
                    onChange={resumeFormFormik.handleChange}
                    value={resumeFormFormik.values.profile.summary}
                />
            </div>
        </>
    );
};
