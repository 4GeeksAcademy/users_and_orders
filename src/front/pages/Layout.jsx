import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import "./Layout.css"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="layout-container">
                <Navbar />
                <main className="layout-main">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ScrollToTop>
    )
}