export class apSelectItem extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({"mode":"open"});
        let template = this.init();
        this.shadow.append(template.content.cloneNode(true));
        
        this.open = false;
        
    }

    init() {
        const template = document.createElement('template');
        
        template.innerHTML = `
            <style>

                :host {

                    display: block;
                    width: 100%;
                    height: fit-content;

                    --ap-select-item-primary-color: var(--ap-primary-color, #8DD4B7);
                    --ap-select-item-secondary-color: var(--ap-secondary-color, #3F6077);
                    --ap-select-item-neutral-primary-color: var(--ap-neutral-primary-color, #e5e5e5);

                }

                li {

                    text-align: center;
                    padding: 0.5rem;
                }

                :host(:not([selected]):hover) {
                    background-color: var(--ap-select-item-secondary-color);
                    color: var(--ap-select-item-neutral-primary-color);
                }

                :host([selected]) {
                    background-color: var(--ap-select-item-primary-color);
                }

            </style>


            <li><slot></slot></li>
        `;

        return template;
    }

}

customElements.define("ap-select-item",apSelectItem);