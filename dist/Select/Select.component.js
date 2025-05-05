export class apSelect extends HTMLElement {

    #selectedOptionValue;
    #open;

    constructor() {
        super();
        this.shadow = this.attachShadow({"mode":"open"});
        let template = this.init();
        this.shadow.append(template.content.cloneNode(true));

        const apSelect = this.shadow.getElementById('ap-select');
        
        this.#open = false;

        Object.defineProperty(this,"open",
            {
                get() {
                    return this.#open;
                },
                set(newVal) {
                    if(this.#open !== newVal) {
                        this.#open = newVal;
                        this.#open ? this.dispatchEvent(new Event('open',{"composed":true})) : this.dispatchEvent(new Event('closed',{"composed":true}));
                    }
                },
                configurable: true
            }
        )

        Object.defineProperty(this,"selectedOptionValue",
            {
                get() {
                    return this.#selectedOptionValue;
                },
                set(newVal) {
                    if(this.#selectedOptionValue !== newVal) {
                        this.#selectedOptionValue = newVal;
                        this.dispatchEvent(new Event('change',{"composed":true,"bubbles":true}));
                    }
                },
                configurable: true
            }
        )

        
    }

    connectedCallback() {

        const slotted = this.shadow.querySelector('slot').assignedElements();
        const apSelected = this.shadow.querySelector('#ap-selected-text');
        const apSelectList = this.shadow.querySelector('#ap-select-list');

        apSelected.addEventListener('click', () => {
            this.open = !this.open;
        })

        this.addEventListener('open', () => {
            apSelectList.classList.add('active');
        })

        this.addEventListener('closed', () => {
            apSelectList.classList.remove('active');
        })

        document.addEventListener('click',(event) => {
            event.stopPropagation();
            if(event.target !== this) {
                this.open = false;
            }
        })

        slotted.forEach(slot => {
            
            slot.addEventListener('click', (event) => {
                event.stopPropagation();
                if(event.target !== this.selected) {
                    this.selected.removeAttribute('selected');
                    this.selected = slot;
                    this.selectedOptionValue = this.selected.getAttribute('value');
                    this.selected.setAttribute('selected','');
                    apSelected.textContent = this.selected.getAttribute('value');
                }
                this.open = false;
            })

            if(slot.hasAttribute('selected')) {
                this.selected = slot;
                apSelected.textContent = this.selected.getAttribute('value');
            }
        });
    }

    init() {
        const template = document.createElement('template');
        
        template.innerHTML = `
            <style>

                :host {
                    --ap-select-outline-color-primary: var(--ap-outline-color-primary,#bec2c7);
                }
            
                .ap-select {
                    width: fit-content;
                    height: 2rem;
                    
                    border: 1px solid var(--ap-select-outline-color-primary);
                    border-radius: 0.5rem;

                    display: grid;
                    grid-template: 100% 1fr / 1fr;


                    justify-content: center;
                    align-items: center;

                    gap: 0.5rem 0;

                    scrollbar-width: 0;
                }

                .ap-select::-webkit-scrollbar {
                    width: 0;
                }

                .ap-select > p {
                    margin-block: 0;

                    display: flex;

                    height: 100%;

                    align-items: center;
                    justify-content: center;

                    grid-area: 1 / 1 / 2 / 2;

                }

                .ap-select > ul {
                    border: 1px solid var(--ap-select-outline-color-primary);
                    padding: 0;
                    list-style: none;

                    border-radius: 0.5rem;

                    height: 12rem;
                    overflow-y: scroll;

                    scrollbar-width: none;

                    margin-block: 0;

                    grid-area: 2 / 1 / 3 / 2;

                    display: block;
                    visibility: hidden;
                }

                .ap-select > ul.active {
                    visibility: visible;
                }

                .ap-select > ul::-webkit-scrollbar {
                    width: none;
                }

            </style>

            <div id="ap-select" open class="ap-select">
                <p id="ap-selected-text"></p>
                <ul id="ap-select-list">
                    <li><slot></slot></li>
                </ul>
            </div>
        `;

        return template;
    }

}

customElements.define("ap-select",apSelect);