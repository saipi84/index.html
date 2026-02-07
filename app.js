function initFirebase() {
    console.log("🔥 Pokušavam da povežem Firebase...");
    console.log("Config:", window.firebaseConfig);
    
    try {
        if (!window.firebaseConfig) {
            console.error("❌ Firebase konfiguracija nije pronađena!");
            console.log("Da li je firebase-config.js učitavan?");
            return false;
        }
        
        console.log("🔧 Inicijalizujem Firebase...");
        firebase.initializeApp(window.firebaseConfig);
        db = firebase.database();
        console.log("✅ Firebase spojen!");
        
        // Testiraj konekciju
        db.ref('testConnection').set({
            deviceId: deviceId,
            connectedAt: Date.now(),
            message: "ZSVA App radi!"
        }).then(() => {
            console.log("✅ Test podaci poslati na Firebase");
        }).catch((error) => {
            console.error("❌ Greška pri slanju:", error);
        });
        
        return true;
    } catch (error) {
        console.log("❌ Firebase greška:", error);
        console.log("Detalji:", error.message);
        return false;
    }
}
