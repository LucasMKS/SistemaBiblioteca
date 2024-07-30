import React from 'react'

const FooterComponent = () => {
    return (
        <div>
            <footer className='p-2 w-full text-center'>
                <span>LucasM | All Right Reserved &copy; {new Date().getFullYear()} </span>
            </footer>
        </div>
    )
}

export default FooterComponent