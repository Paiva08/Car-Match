import Calculator from './pages/Calculator';
import Cars from './pages/Cars';
import Comparison from './pages/Comparison';
import SavedComparisons from './pages/SavedComparisons';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Calculator": Calculator,
    "Cars": Cars,
    "Comparison": Comparison,
    "SavedComparisons": SavedComparisons,
}

export const pagesConfig = {
    mainPage: "Calculator",
    Pages: PAGES,
    Layout: __Layout,
};