export function dragElement(element: HTMLElement, e: MouseEvent, savePosition: boolean = true): Promise<boolean> {

    return new Promise(resolve => {

        e.preventDefault();

        const dragThreshold = 5;

        const startX = e.pageX;
        const startY = e.pageY;

        let draggableElementRect = element.getBoundingClientRect();

        let shiftX = e.pageX - draggableElementRect.left;
        let shiftY = e.pageY - draggableElementRect.top;
        let isMoved = false;

        let onMouseMove = (event: MouseEvent) => {
            const deltaX = Math.abs(event.pageX - startX);
            const deltaY = Math.abs(event.pageY - startY);

            if (deltaX < dragThreshold && deltaY < dragThreshold) {
                return;
            }

            if (savePosition) {
                isMoved = true;
            }

            event.preventDefault();
            event.stopImmediatePropagation();

            draggableElementRect = element.getBoundingClientRect();

            let top = event.pageY - shiftY;
            let left = event.pageX - shiftX;

            /*if intersect top window*/
            if (top < 0) {
                top = 0;
            }
            /*if intersect bottom window*/
            if ((top + draggableElementRect.height) > document.documentElement.clientHeight) {
                top = document.documentElement.clientHeight - draggableElementRect.height;
            }
            /*if intersect left window*/
            if (left < 0) {
                left = 0;
            }
            /*if intersect right window*/
            if ((left + draggableElementRect.width) > document.documentElement.clientWidth + 0.1) {
                left = document.documentElement.clientWidth - draggableElementRect.width;
            }

            element.style.left = (left / (document.documentElement.clientWidth / 100)) + "%";
            element.style.top = (top / (document.documentElement.clientHeight / 100)) + "%";
        }


        function onMouseUp(event: Event) {
            document.removeEventListener("mousemove", onMouseMove, true);
            document.removeEventListener("mouseup", onMouseUp, true);

            if (isMoved) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }

            resolve(isMoved);
        };

        document.addEventListener("mousemove", onMouseMove, true);
        document.addEventListener("mouseup", onMouseUp, true);
    })
}