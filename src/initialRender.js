import { productRender } from "./inventory";
// import { productSidebar } from "./selectors"
import { products } from "./states";

const initialRender = () => {
    productRender(products);
    //open product side bar when open the website
    // productSidebar.classList.remove("translate-x-full");
    
}
export default initialRender;