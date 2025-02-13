import React from "react";
import Header from "./Header";

function NotFound(){

    return(
        <div>
            <div>
                <Header/>
            </div>
            <div>
                Sorry, we cannot find this page.
            </div>
            {/* Footer */}
        <footer className="bg-white py-6 border-t-4 text-black">
            <div className="container mx-auto text-center">
            <p>&copy; 2025 The Tattered Page. All rights reserved. | Made with ❤️ for book lovers</p>
            </div>
        </footer>
        </div>
    )
}
export default NotFound;