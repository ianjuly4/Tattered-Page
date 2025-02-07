import React from "react";
import Header from "./Header";

function Home(){

    return(
        <div>
            <div>
                <Header/>
            </div>
            <div className="hero bg-primary min-h-screen">
            <div className="hero-content flex-col lg:flex-row">
                <img
                src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                className="max-w-sm rounded-lg shadow-2xl" />
                <div>
                <h1 className="text-5xl font-bold">Welcome to The Tattered Page</h1>
                <p className="py-6">Your Cozy Digital Reading Nook 🌙📚</p>
                <p>
                    Get ready to dive into a world of books where the stories never end and the conversations are just as captivating. Whether you’re curling up with a good book, discovering your next favorite read, or chatting with fellow book lovers, The Tattered Page is the place where readers like you come together.

                    Join our community of passionate readers—explore new books, share your thoughts, or simply unwind in a relaxing, lofi-inspired space designed for book lovers. Here, every chapter sparks a new connection. Let's create our own reading adventure. Ready to turn the page? 📖
                </p>
                <button className="btn btn-primary">Get Started</button>
                </div>
            </div>
            </div>
        </div>
    )
}
export default Home;