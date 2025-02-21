import React, { useState, useContext } from 'react';
import { MyContext } from '../../MyContext';

const AvatarDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { updateUserAttribute } = useContext(MyContext);

    const avatarOptions = [
        { id: 'smile', name: 'smile', url: 'https://api.dicebear.com/9.x/fun-emoji/svg?eyes=closed' },
        { id: 'cool', name: 'cool', url: `https://api.dicebear.com/9.x/fun-emoji/svg?eyes=shades` },
        { id: 'glasses', name: 'glasses', url: 'https://api.dicebear.com/9.x/fun-emoji/svg?eyes=glasses,' }
    ];

    const toggleDropdown = () => setIsOpen(prev => !prev);

    const handleSelect = (avatar) => {
        updateUserAttribute("avatar", avatar.url);
        
        setIsOpen(false); 
    };

    return (
        <div className="relative">
            <button className="btn btn-secondary btn-sm" onClick={toggleDropdown}>
                Edit Avatar
            </button>

            {isOpen && (
                <div className="absolute mt-2 w-auto bg-primary shadow-lg rounded-lg z-10">
                    <ul className="flex space-x-4"> {/* Use flex and space-x-4 for horizontal layout */}
                        {avatarOptions.map((avatar) => (
                            <li
                                key={avatar.id}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSelect(avatar)}
                            >
                                <img src={avatar.url} alt={avatar.name} className="w-10 h-10 rounded-full mr-2 inline-block" />
                                {avatar.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AvatarDropdown;
