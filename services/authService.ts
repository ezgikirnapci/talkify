import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { API_BASE_URL } from "../config/apiConfig";
import { auth } from "../config/firebaseConfig";

const API_URL = API_BASE_URL;

export const register = async (email: string, password: string, username?: string) => {
    // Trim inputs to avoid accidental leading/trailing spaces
    email = email.trim();
    password = password.trim();
    console.log("Registering with Firebase:", email);
    try {
        // 1. Firebase ile kayıt ol
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Firebase registration success, UID:", user.uid);

        // 2. Kendi backend'imize bilgileri gönder (Senkronizasyon)
        let backendError: string | null = null;
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    username: username || email.split('@')[0],
                    firebase_uid: user.uid
                }),
            });

            const responseData = await response.json();
            console.log("Backend sync response:", response.status, responseData);

            if (!response.ok) {
                // Backend returned an error (validation failed, user exists, etc.)
                backendError = responseData.error || responseData.message || 'Backend kayıt başarısız.';
                console.error("Backend registration failed:", backendError);
            }
        } catch (networkError: any) {
            console.error("Backend sync network error:", networkError);
            backendError = 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
        }

        // If backend sync failed, roll back Firebase user
        if (backendError) {
            try {
                if (user && typeof (user as any).delete === 'function') {
                    await (user as any).delete();
                    console.warn('Rolled back Firebase user after backend sync failure');
                }
            } catch (deleteErr) {
                console.error('Failed to delete Firebase user after backend failure:', deleteErr);
            }

            const err: any = new Error(backendError);
            err.code = 'backend_sync_failed';
            err.serverMessage = backendError;
            throw err;
        }

        return { user };
    } catch (error: any) {
        console.error("Register error:", error);
        console.error("Register error code:", error.code);

        // Try to extract identitytoolkit server message (e.g. EMAIL_EXISTS, WEAK_PASSWORD)
        const serverMsg = error?.customData?._tokenResponse?.error?.message || error?.customData?._tokenResponse || error?.code;

        let userMessage = 'Kayıt sırasında bir hata oluştu.';
        if (error.code === 'auth/email-already-in-use' || serverMsg === 'EMAIL_EXISTS') {
            userMessage = 'Bu e-posta adresi zaten kayıtlı.';
        } else if (error.code === 'auth/weak-password' || serverMsg === 'WEAK_PASSWORD') {
            userMessage = 'Şifre en az 6 karakter olmalıdır.';
        } else if (error.code === 'auth/invalid-email' || serverMsg === 'INVALID_EMAIL') {
            userMessage = 'Geçersiz e-posta adresi.';
        } else if (serverMsg === 'OPERATION_NOT_ALLOWED') {
            userMessage = 'E-posta/şifre ile giriş devre dışı bırakılmış.';
        } else if (serverMsg === 'USER_DISABLED') {
            userMessage = 'Hesabınız devre dışı bırakılmış.';
        }

        if (typeof serverMsg === 'string') {
            console.error('Firebase register server message:', serverMsg);
        }

        const err: any = new Error(userMessage);
        err.code = error.code || serverMsg;
        err.serverMessage = serverMsg;
        throw err;
    }
};

export const login = async (email: string, password: string) => {
    // Trim inputs to avoid accidental leading/trailing spaces
    email = email.trim();
    password = password.trim();
    console.log("Logging in with Firebase:", email);
    try {
        // 1. Firebase ile giriş yap
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Firebase login success, UID:", user.uid);

        // 2. Backend'e bildir ve JWT al (varsa)
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const backData = await response.json();
            console.log("Backend login/sync response:", backData);
            return { user, token: backData.access_token };
        } catch (backendError) {
            console.error("Backend login sync failed:", backendError);
            return { user }; // Backend kapalı olsa bile Firebase girişi başarılı
        }
    } catch (error: any) {
        console.error("Login service error:", error);
        console.error("Login error code:", error.code);

        // Try to extract identitytoolkit server message (e.g. INVALID_PASSWORD, EMAIL_NOT_FOUND, MFA_REQUIRED)
        const serverMsg = error?.customData?._tokenResponse?.error?.message || error?.customData?._tokenResponse || error?.code;

        let userMessage = 'Giriş yapılamadı.';
        if (serverMsg === 'INVALID_PASSWORD' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            userMessage = 'E-posta veya şifre yanlış.';
        } else if (serverMsg === 'EMAIL_NOT_FOUND' || error.code === 'auth/user-not-found') {
            userMessage = 'Kayıtlı kullanıcı bulunamadı. Lütfen önce kayıt olun.';
        } else if (serverMsg === 'USER_DISABLED') {
            userMessage = 'Hesabınız devre dışı bırakılmış.';
        } else if (serverMsg === 'MFA_REQUIRED') {
            userMessage = 'Hesabınız iki faktörlü doğrulama etkin. Lütfen ikinci faktörü tamamlayın.';
        } else if (error.code === 'auth/invalid-email') {
            userMessage = 'Geçersiz e-posta adresi.';
        } else if (error.code === 'auth/too-many-requests') {
            userMessage = 'Çok fazla hatalı deneme. Lütfen sonra tekrar deneyin.';
        } else if (typeof serverMsg === 'string') {
            // Fallback: expose server message in console for debugging, but show generic message to user
            console.error('Firebase server message:', serverMsg);
            userMessage = 'Giriş sırasında bir hata oluştu.';
        }

        const err: any = new Error(userMessage);
        err.code = error.code || serverMsg;
        err.serverMessage = serverMsg;
        throw err;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Çıkış hatası:", error);
    }
};
