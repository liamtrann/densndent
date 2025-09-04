import { Breadcrumb } from "common";

import ProfileEditCard from "../profile/ProfileEditCard";

const ProfileSetupWelcome = ({ onClose }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Breadcrumb path={["Home", "Profile"]} />

      <div className="bg-primary-blue/10 border border-primary-blue/30 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-primary-blue mb-2">
          Welcome to JDIQ Dental!
        </h2>
        <p className="text-primary-blue/80 mb-4">
          To get started with shopping and managing your orders, please complete
          your profile below.
        </p>
        <div className="flex items-center text-sm text-primary-blue/70">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          This only takes a minute and helps us provide better service
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProfileEditCard onClose={onClose} />
      </div>
    </div>
  );
};

export default ProfileSetupWelcome;
