export function dragElement(e: MouseEvent, element: HTMLElement) {

    return new Promise((resolve) => {

        let draggableElementRect = element.getBoundingClientRect()
        let shiftX = e.pageX - draggableElementRect.left;
        let shiftY = e.pageY - draggableElementRect.top;

        element.style.position = "absolute";

        element.addEventListener('mousemove', onMouseMove);
        element.addEventListener('mouseup', onMouseUp);

        function onMouseMove(event: MouseEvent) {
            event.preventDefault();
            event.stopImmediatePropagation();

            draggableElementRect = element.getBoundingClientRect();

            let top = event.pageY - shiftY;
            let left = event.pageX - shiftX;

            if (top < 0) {
                top = 0;
            }

            if ((top + draggableElementRect.height) > document.documentElement.clientHeight) {
                top = document.documentElement.clientHeight - draggableElementRect.height;
            }

            if (left < 0) {
                left = 0;
            }

            if ((left + draggableElementRect.width) > document.documentElement.clientWidth + 0.1) {
                left = document.documentElement.clientWidth - draggableElementRect.width;
            }

            element.style.left = (left / (document.documentElement.clientWidth / 100)) + "%";
            element.style.top = (top / (document.documentElement.clientHeight / 100)) + "%";
        }


        function onMouseUp(event: Event) {
            element.removeEventListener('mousemove', onMouseMove);
            element.removeEventListener('mouseup', onMouseUp);

            event.preventDefault();
            event.stopPropagation();

            element.style.position = "fixed";


            resolve(element);

        }
    })
}