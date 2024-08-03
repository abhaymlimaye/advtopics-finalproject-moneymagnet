import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, child, push, update, get, set, onValue, runTransaction, serverTimestamp } from "firebase/database";
import { initializeAuth, onAuthStateChanged, getReactNativePersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

class RealtimeDatabase {
    constructor() {
        if (!RealtimeDatabase.instance) {
            const firebaseConfig = {
                apiKey: "AIzaSyAtecgRrNBEO96UOA_EszqzhaIItgS8WHA",
                authDomain: "crossplatform-lab-e922f.firebaseapp.com",
                databaseURL: "https://crossplatform-lab-e922f-default-rtdb.firebaseio.com",
                projectId: "crossplatform-lab-e922f",
                storageBucket: "crossplatform-lab-e922f.appspot.com",
                messagingSenderId: "798170205892",
                appId: "1:798170205892:web:bbb9956676d9d5b70d0391"
            };

            let app;
            if (!getApps().length) app = initializeApp(firebaseConfig);
            else app = getApp();  
            
            this.db = getDatabase(app);
            this.auth = initializeAuth(app, {
                persistence: getReactNativePersistence(ReactNativeAsyncStorage)
            });

            RealtimeDatabase.instance = this;
        }

        return RealtimeDatabase.instance;        
    }

    //userRef = () => ref(this.db, this.userId());

    userId = () => {
        const user = this.auth.currentUser;
        return user ? user.uid : null;    
    }

    ordersRef = () => ref(this.db, `${this.userId()}/orders`);
    holdingsRef = () => ref(this.db, `${this.userId()}/holdings`);

    ordersChildRef = childRef => child(this.ordersRef(), childRef);
    holdingsChildRef = childRef => child(this.holdingsRef(), childRef);

    listenAuthStatus = callback => { onAuthStateChanged(this.auth, callback) };

    login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(this.auth, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    register = async (email, password) => {
        try {
            const response = await createUserWithEmailAndPassword(this.auth, email, password);
            //await set(this.userRef(), { orders: null, holdings: null }); // Initialize user data
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    logout = async () => {
        try {
            await this.auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    placeOrder = async (fundId, fundName, amount, orderType) => {
        console.log('\n\n\n1-p Order placing...');
        const snapshot = await push(this.ordersRef(), { fundId, fundName, amount, orderType, status: 'pending', timestamp: serverTimestamp() });
        this.simulateExecuteOrder(snapshot.key, fundId, fundName, amount, orderType);
    };

    simulateExecuteOrder = async (orderId, fundId, fundName, amount, orderType) => {
        console.log('2-p Simulating execution...');
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        await delay(8000);

        try {
            await this.determineExecutability(fundId, amount, orderType);
            await this.updateHoldings(fundId, fundName, amount, orderType);
            this.updateOrderStatus(orderId, 'complete');
        } catch (error) {
            this.updateOrderStatus(orderId, 'failed', error);
        }
    };

    determineExecutability = async (fundId, amount, orderType) => {
        console.log('3-p Determining executability...');
        if (orderType === "buy")
            return amount > 100000 ? Promise.reject('Amount exceeds the allowable limit') : Promise.resolve();
        else if (orderType === "sell") {
            const snapshot = await get(this.holdingsChildRef(fundId));
            if (!snapshot.exists()) Promise.reject('No holdings found');
            return snapshot.val().amount < amount ? Promise.reject('Insufficient holdings') : Promise.resolve();
        } else return Promise.reject('Invalid order type');
    };

    updateHoldings = (fundId, fundName, amount, orderType) => {
        console.log('4-p Updating holdings...');
        return runTransaction(this.holdingsChildRef(fundId), currentHolding => {
            if (currentHolding === null) {
                if (orderType === "buy") return { fundName: fundName, amount: amount };
                else if (orderType === "sell") return null;
                else return currentHolding;
            } else {
                if (orderType === "buy") return { ...currentHolding, amount: (currentHolding.amount || 0) + amount };
                else if (orderType === "sell") {
                    const updatedAmount = (currentHolding.amount || 0) - amount;
                    if (updatedAmount === 0) return null;
                    return { ...currentHolding, amount: updatedAmount };
                } else return currentHolding;
            }
        });
    };

    updateOrderStatus = (orderId, status, error) => {
        console.log(`5-p Updating order status to ${status}...`);
        const updatedOrder = error ? { status: status, error: error } : { status: status };
        update(this.ordersChildRef(orderId), updatedOrder);
    };

    getHoldings = callback => {
        console.log(`\n\n\nFetching Holdings from: ${this.holdingsRef()}`);
        onValue(this.holdingsRef(), snapshot => {
            console.log('Holdings:-');
            let holdings = [];
            snapshot.exists() && snapshot.forEach(childSnapshot => { holdings.push({ fundId: childSnapshot.key, ...childSnapshot.val() }); });
            console.log(holdings);
            callback(holdings);
        });
    };

    getOrders = callback => {
        console.log(`\n\n\nFetching Orders from: ${this.ordersRef()}`);
        onValue(this.ordersRef(), snapshot => {
            console.log('Orders:-');
            let orders = [];
            snapshot.exists() && snapshot.forEach(childSnapshot => { orders.push({ orderId: childSnapshot.key, ...childSnapshot.val() }); });
            orders.sort((a, b) => b.timestamp - a.timestamp);
            console.log(orders);
            callback(orders);
        });
    };
}

const instance = new RealtimeDatabase();
Object.freeze(instance);

export default instance;
