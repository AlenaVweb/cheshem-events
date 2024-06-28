const content = {
    exhibitions: [
        'assets/exhibitions/1.png',
        'assets/exhibitions/2.png',
        'assets/exhibitions/3.png',
    ],
    sentenses: [
        'assets/sentenses/2-2.png',
        'assets/sentenses/2-3.png',
        'assets/sentenses/2-4.png',
        'assets/sentenses/2-5.png',
        'assets/sentenses/2-1.png',
    ],
    dishes: [
        'assets/dishes/1-2.png',
        'assets/dishes/1-3.png',
        'assets/dishes/1-4.png',
        'assets/dishes/1-5.png',
        'assets/dishes/1-1.png',
    ],
}

const WRAPPER_CLASS_NAME = 'slides-wrapper';
const SLIDE_CLASS_NAME = 'slide';
const ANIMATION_DURATION = 600;

const getElementWidth = (element) => {
    return parseInt(window.getComputedStyle(element).getPropertyValue('width'));
};

const getSlideId = (slider, index) => {
    return `${slider.id}-${index}`;
};

const getIndexFromSlideId = (slideId) => {
    return parseInt(slideId.split('-')[1]);
}

const createSlidesWrapper = (slider) => {
    const wrapper = document.createElement('div');

    wrapper.className = WRAPPER_CLASS_NAME;

    slider.appendChild(wrapper);

    return wrapper;
};

const createSlide = (slider, index, shouldShowAnimation = false) => {
    const sliderContent = content[slider.id];
    index = (index + sliderContent.length) % sliderContent.length;

    const slide = document.createElement('div');

    slide.id = getSlideId(slider, index);
    slide.className = SLIDE_CLASS_NAME;
    slide.style.backgroundImage = `url('${sliderContent[index]}')`;

    if (shouldShowAnimation) {
        slide.style.animationName = 'slideIn';
    }

    return slide;
};

const removeSlide = (slider, index, shouldShowAnimation = false) => {
    const slide = document.getElementById(getSlideId(slider, index))

    if (!slide) {
        return;
    }

    if (shouldShowAnimation) {
        slide.style.animationName = 'slideOut';

        setTimeout(
            () => slide.remove(),
            ANIMATION_DURATION,
        );
    } else {
        slide.remove();
    }
};

const shouldShowActions = (slider) => {
    const slidesAmount = content[slider.id].length;
    const currentSlidesAmount = slider.getElementsByClassName(SLIDE_CLASS_NAME).length;

    return slidesAmount > currentSlidesAmount;
};

const blockButtons = (slider) => {
    const buttons = slider.getElementsByClassName('slider-button');

    for (const button of buttons) {
        button.disabled = true;
    }
};

const unlockButtons = (slider) => {
    const buttons = slider.getElementsByClassName('slider-button');

    for (const button of buttons) {
        button.disabled = false;
    }
}

const onPreviousButtonClick = (event) => {
    const slider = event.target.closest('.slider');

    blockButtons(slider);

    const slides = slider.getElementsByClassName(SLIDE_CLASS_NAME);

    const firstIndex = getIndexFromSlideId(slides[0].id);
    const lastIndex = getIndexFromSlideId(slides[slides.length - 1].id);

    const wrapper = slider.querySelector(`.${WRAPPER_CLASS_NAME}`);
    wrapper.prepend(createSlide(slider, firstIndex - 1, true));

    removeSlide(slider, lastIndex, true)

    setTimeout(
        () => unlockButtons(slider),
        ANIMATION_DURATION,
    )
};

const createPreviousButton = () => {
    const previousButton = document.createElement('button');
    previousButton.className = 'slider-previous slider-button';

    previousButton.addEventListener('click', onPreviousButtonClick);

    return previousButton;
};

const onNextButtonClick = (event) => {
    const slider = event.target.closest('.slider');

    blockButtons(slider);

    const slides = slider.getElementsByClassName(SLIDE_CLASS_NAME);

    const firstIndex = getIndexFromSlideId(slides[0].id);
    const lastIndex = getIndexFromSlideId(slides[slides.length - 1].id);

    removeSlide(slider, firstIndex, true)

    const wrapper = slider.querySelector(`.${WRAPPER_CLASS_NAME}`);
    wrapper.append(createSlide(slider, lastIndex + 1, true));

    setTimeout(
        () => unlockButtons(slider),
        ANIMATION_DURATION,
    )
};

const createNextButton = () => {
    const nextButton = document.createElement('button');
    nextButton.className = 'slider-next slider-button';

    nextButton.addEventListener('click', onNextButtonClick);

    return nextButton;
};

const showActions = (slider) => {
    const previousButton = createPreviousButton();

    const nextButton = createNextButton();

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'slider-actions-wrapper';

    buttonWrapper.appendChild(previousButton);
    buttonWrapper.appendChild(nextButton);

    slider.appendChild(buttonWrapper);
};

const removeActions = (slider) => {
    slider.getElementsByClassName('slider-actions-wrapper')?.[0]?.remove();
};

export const initSlider = (slider) => {
    const wrapper = createSlidesWrapper(slider);
    let slide = wrapper.querySelector(`.${SLIDE_CLASS_NAME}`);

    const sliderContent = content[slider.id];

    const sliderWidth = getElementWidth(slider);
    let wrapperWidth = getElementWidth(wrapper);
    let slideWidth = slide ? getElementWidth(slide) : 0;

    for (const index of sliderContent.keys()) {
        if (wrapperWidth + slideWidth > sliderWidth) {
            break;
        }

        wrapper.append(createSlide(slider, index));

        if (!slide) {
            slide = wrapper.querySelector(`.${SLIDE_CLASS_NAME}`);
        }

        wrapperWidth = getElementWidth(wrapper);
        slideWidth = getElementWidth(slide);
    }

    if (shouldShowActions(slider)) {
        showActions(slider);
    } else {
        removeActions(slider);
    }
}

const removeSlider = (slider) => {
    slider.getElementsByClassName(WRAPPER_CLASS_NAME)?.[0].remove();

    removeActions(slider);
}

const shouldRerender = (slider) => {
    const wrapper = slider.getElementsByClassName(WRAPPER_CLASS_NAME)[0];
    const slide = wrapper.getElementsByClassName(SLIDE_CLASS_NAME)?.[0];

    const sliderWidth = getElementWidth(slider);
    const wrapperWidth = getElementWidth(wrapper);
    const slideWidth = slide ? getElementWidth(slide) : 0;

    return wrapperWidth > sliderWidth || (wrapperWidth + slideWidth) < sliderWidth;
}

export const adjustSlider = (slider) => {
    if (!shouldRerender(slider)) {
        return;
    }

    removeSlider(slider);
    initSlider(slider);
}

export const applyToSliders = (sliders, callback) => {
    for (const slider of sliders) {
        callback(slider);
    }
}

const sliders = document.getElementsByClassName('slider');

window.addEventListener('DOMContentLoaded', () => applyToSliders(sliders, initSlider))
window.addEventListener('resize', () => applyToSliders(sliders, adjustSlider));
