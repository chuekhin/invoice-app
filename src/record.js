import { createRecordForm, recordGroup, recordNettotal, recordRowTemplate, recordTax, recordTotal, } from "./selectors";
import { v4 as uuidv4 } from 'uuid';
import { products } from "./states";
import Swal from "sweetalert2";

export const createRecordFormHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(createRecordForm);
    // console.log(formData.get("product_select"));
    // console.log(formData.get("quantity"));

    const currentProduct =  products.find(({id}) => id == formData.get("product_select"));
    const isExitedRecord = document.querySelector(`[product-id='${currentProduct.id}']`)
    if(isExitedRecord == null){
        recordGroup.append(createRecordRow(currentProduct,formData.get("quantity")));
    }else{
        // Swal.fire("already existed");
        Swal.fire({
            title:`Are you sure to add quantity to ${currentProduct.name}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, add it!"
          }).then((result) => {
            if (result.isConfirmed) {
                updateRecordQuantity(isExitedRecord.getAttribute("row-id"),parseInt(formData.get("quantity")))
            }
          });
    }

    createRecordForm.reset();    
}


export const createRecordRow = ({id,name,price},quantity) => {
    const recordRow = recordRowTemplate.content.cloneNode(true);
    const recordProductName = recordRow.querySelector(".record-product-name");
    const recordProductPrice = recordRow.querySelector(".record-product-price");
    const recordQuantity = recordRow.querySelector(".record-quantity");
    const recordCost = recordRow.querySelector(".record-cost");
    const currentRecordRow = recordRow.querySelector(".record-row");

    currentRecordRow.setAttribute("product-id",id);
    currentRecordRow.setAttribute("row-id",uuidv4());

    recordProductName.innerText = name;
    recordProductPrice.innerText = price;
    recordQuantity.innerText = quantity;
    recordCost.innerText = price * quantity;

 return recordRow;
}

export const calculateTax = (amount,percentage=5) => (amount/100) * percentage

export const calculateRecordTotal = () => {
    let total = 0;
    recordGroup.querySelectorAll(".record-cost").forEach(
        (el) => {
            total += parseFloat(el.innerText);
        }
    )
    return total;
}

export const removeRecord = (rowId) => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
            const currentRecordRow = recordGroup.querySelector(`[row-id='${rowId}']`);
            console.log(currentRecordRow);
            currentRecordRow.remove();
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
}

// export const quantityAdd = (rowId) => {
//     const currentRecordRow = recordGroup.querySelector(`[row-id='${rowId}']`);
//     const recordProductPrice = currentRecordRow .querySelector(".record-product-price");
//     const recordQuantity = currentRecordRow .querySelector(".record-quantity");
//     const recordCost = currentRecordRow .querySelector(".record-cost");

//     recordQuantity.innerText = parseInt(recordQuantity.innerText) +1;
//     recordCost.innerText=recordProductPrice.innerText * recordQuantity.innerText
    
// }

// export const quantitySubtract = (rowId) => {
//     const currentRecordRow = recordGroup.querySelector(`[row-id='${rowId}']`);
//     const recordProductPrice = currentRecordRow .querySelector(".record-product-price");
//     const recordQuantity = currentRecordRow .querySelector(".record-quantity");
//     const recordCost = currentRecordRow .querySelector(".record-cost");
//     if(recordQuantity.innerText > 1){
//         recordQuantity.innerText = parseInt(recordQuantity.innerText) -1;
//         recordCost.innerText=recordProductPrice.innerText * recordQuantity.innerText
//     }
// }

export const updateRecordQuantity = (rowId,newQuantity) => {
    const currentRecordRow = recordGroup.querySelector(`[row-id='${rowId}']`);
        const recordProductPrice = currentRecordRow .querySelector(".record-product-price");
        const recordQuantity = currentRecordRow .querySelector(".record-quantity");
        const recordCost = currentRecordRow .querySelector(".record-cost");
        // console.log(newQuantity);
        // console.log(recordQuantity.innerText);
        if(newQuantity >=1 || recordQuantity.innerText > 1){
            recordQuantity.innerText = parseInt(recordQuantity.innerText) + newQuantity;
            recordCost.innerText=recordProductPrice.innerText * recordQuantity.innerText;
        }
}

export const recordGroupHandler = (event) => {
    // console.log(event.target);
    if(event.target.classList.contains("record-remove")){
        const currentRecordRow = event.target.closest(".record-row");
        // console.log(currentRecordRow);
        removeRecord(currentRecordRow.getAttribute("row-id"));
    }else if(event.target.classList.contains("quantity-add")){
        const currentRecordRow = event.target.closest(".record-row");
        updateRecordQuantity(currentRecordRow.getAttribute("row-id"),1);    
    }else if(event.target.classList.contains("quantity-sub")){
        const currentRecordRow = event.target.closest(".record-row");
        updateRecordQuantity(currentRecordRow.getAttribute("row-id"),-1);
        
    }
    
}

export const recordGroupObserver = () => {
    const observerOptions = {
        childList: true,
        subtree: true,
      };

    const updateTotal = () => {
        const total = calculateRecordTotal();
        const tax = calculateTax(total);
        recordTotal.innerText = total;
        recordTax.innerText =tax;
        recordNettotal.innerText = total + tax;
     }

    const observer = new MutationObserver(updateTotal);
    observer.observe(recordGroup,observerOptions);
}


         

