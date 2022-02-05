import { getCompany } from '../services/service'

function company() {
    const url ="https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";

    const nameShort = document.querySelector("#name_short"),
      nameFull = document.querySelector("#name_full"),
      innResult = document.querySelector("#inn_kpp"),
      addressResult = document.querySelector("#address"),
      typeResult = document.querySelector("#type"),
      parent = document.querySelector(".list"),
      input = document.querySelector("#party");
  
    function render(value, inn, address, kpp, fullName, type) {
      const element = document.createElement("li");
      element.classList.add("list_item");
  
      element.innerHTML = `
              <div class="list_item-name">${value}</div>
              <div class='list_bottom'>    
                  <div class="list_item-inn">${inn}</div>
                  <div class="list_item-address">${address}</div>        
              </div>
          `;
      parent.append(element);
  
      element.addEventListener("click", () => {
        console.log(address, inn, kpp);
        nameShort.value = value;
        nameFull.value = fullName;
        innResult.value = kpp == undefined ? inn : `${inn} / ${kpp}`;
        addressResult.value = address;
        typeResult.innerText =
          type === "LEGAL"
            ? `Организация (${type})`
            : `Индивидуальный предприниматель (${type})`;
        parent.style.display = "none";
      });
    }
  

  
    input.addEventListener("input", (e) => {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
  
      getCompany(url, e.target.value).then((data) => {
        const lable =
          data.suggestions.length === 0
            ? `<p class="list_lable">Неизвестная организация</p>`
            : `<p class="list_lable">Выберите вариант или продолжите ввод</p>`;
        parent.innerHTML = lable;
  
        parent.style.display = e.target.value.length === 0 ? "none" : "block";
  
        data.suggestions.forEach((item) => {
          render(
            item.value,
            item.data.inn,
            item.data.address.unrestricted_value,
            item.data.kpp,
            item.data.name.full_with_opf,
            item.data.type
          );
        });
      });
    });
}

export default company;