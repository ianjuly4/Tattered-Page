import React from "react";
import Header from "./Header";
import bookNook from "../assets/bookNook.jpg"
function Home(){

    return(
        <div>
            <div className="sticky top-0 z-10">
                <Header/>
            </div>
            <div className="hero bg-secondary min-h-screen">
            <div className="hero-content flex-col lg:flex-row">
                <img
                src={bookNook}
                className="max-w-sm rounded-lg shadow-2xl" />
                <div>
                <h1 className="text-5xl font-bold">Welcome to The Tattered Page</h1>
                <p className="py-6">Your Cozy Digital Reading Nook 🌙📚</p>
                <p>
                    Get ready to dive into a world of books where the stories never end and the conversations are just as captivating. Whether you’re curling up with a good book, discovering your next favorite read, or chatting with fellow book lovers, The Tattered Page is the place where readers like you come together.

                    Join our community of passionate readers—explore new books, share your thoughts, or simply unwind in a relaxing, lofi-inspired space designed for book lovers. Here, every chapter sparks a new connection. Let's create our own reading adventure. Ready to turn the page? 📖
                </p>
                </div>
            </div>
            </div>
            <div>bookshelf section</div>
            <div>bookclub section</div>
             {/* Footer */}
            <footer className="bg-white py-6 border-t-4 text-black">
                <div className="container mx-auto text-center">
                <p>&copy; 2025 Your Book Club. All rights reserved. | Made with ❤️ for book lovers</p>
                </div>
            </footer>
        </div>
        
    )
}
export default Home;