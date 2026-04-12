import React from 'react';
import { auth } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const SocialButtons = ({ onAuthSuccess, loading }) => {

    const handleFirebaseLogin = async (providerName) => {
        try {
            let authProvider;
            if (providerName === 'GOOGLE') {
                authProvider = new GoogleAuthProvider();
            } else if (providerName === 'FACEBOOK') {
                authProvider = new FacebookAuthProvider();
            }

            const result = await signInWithPopup(auth, authProvider);
            // Lấy idToken để gửi về Backend xác thực
            const token = await result.user.getIdToken();
            const email = result.user.email;
            const name = result.user.displayName;
            
            onAuthSuccess(providerName, token, email, name);

        } catch (error) {
            console.error(`Firebase ${providerName} Login Failed:`, error);
        }
    };

    return (
        <div className="flex flex-col gap-3 mt-4">
            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Hoặc sử dụng mạng xã hội</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => handleFirebaseLogin('GOOGLE')}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors bg-white text-gray-700 font-semibold text-sm disabled:opacity-50"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Google
                </button>

                <button
                    type="button"
                    onClick={() => handleFirebaseLogin('FACEBOOK')}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors bg-white text-gray-700 font-semibold text-sm disabled:opacity-50"
                >
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
                    Facebook
                </button>
            </div>
        </div>
    );
};

export default SocialButtons;
