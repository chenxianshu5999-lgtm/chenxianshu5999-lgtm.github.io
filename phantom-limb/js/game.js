const Konva = window.Konva;

const width = 1680;
const height = 800;

const gameWidth = 1680;
const gameHeight = 800;

const stage = new Konva.Stage({
    container: "game",
    width: width,
    height: height,
});

const getIsFinished = () => {
    return localStorage.getItem("isFinished") === "true";
}

const gameBoxes = {}

const gameSounds = {
    se: {},
    bgm: null
}

let backgroundImage = null;
let timeStartY = 50;

stage.on("mousedown", (event) => {
    console.log(event.evt.clientX, event.evt.clientY);
})

const backgroundLayer = new Konva.Layer();
const imageLayer = new Konva.Layer();
const touchLayer = new Konva.Layer();
const newTouchLayer = new Konva.Layer();
const textLayer = new Konva.Layer();

stage.add(backgroundLayer);
stage.add(imageLayer);
stage.add(textLayer);
stage.add(newTouchLayer);
stage.add(touchLayer);

let pressedKeys = new Set();
let layerTweens = new Map();
let animationFrame = null;

const parallaxConfig = {
    backgroundLayer: 0.1,
    imageLayer: 0.5,
    textLayer: 0.5,
    newTouchLayer: 1,
    touchLayer: 1
};

const maxOffset = 25;

let targetOffsetX = 0;
let targetOffsetY = 0;

let currentOffsetX = 0;
let currentOffsetY = 0;

const lerpSpeed = 0.12;

const calculateTargetOffset = () => {
    let offsetX = 0;
    let offsetY = 0;
    
    if (pressedKeys.has('a') || pressedKeys.has('A')) offsetX -= maxOffset;
    if (pressedKeys.has('d') || pressedKeys.has('D')) offsetX += maxOffset;
    if (pressedKeys.has('w') || pressedKeys.has('W')) offsetY -= maxOffset;
    if (pressedKeys.has('s') || pressedKeys.has('S')) offsetY += maxOffset;
    
    return { offsetX, offsetY };
};

const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
};

const updateParallaxOffset = () => {
    currentOffsetX = lerp(currentOffsetX, targetOffsetX, lerpSpeed);
    currentOffsetY = lerp(currentOffsetY, targetOffsetY, lerpSpeed);
    
    Object.keys(parallaxConfig).forEach(layerName => {
        const layer = eval(layerName);
        const multiplier = parallaxConfig[layerName];
        
        layer.x(currentOffsetX * multiplier);
        layer.y(currentOffsetY * multiplier);
    });
    
    stage.batchDraw();
    
    const diffX = Math.abs(currentOffsetX - targetOffsetX);
    const diffY = Math.abs(currentOffsetY - targetOffsetY);
    
    if (diffX > 0.1 || diffY > 0.1) {
        animationFrame = requestAnimationFrame(updateParallaxOffset);
    } else {
        currentOffsetX = targetOffsetX;
        currentOffsetY = targetOffsetY;
        
        Object.keys(parallaxConfig).forEach(layerName => {
            const layer = eval(layerName);
            const multiplier = parallaxConfig[layerName];
            
            layer.x(currentOffsetX * multiplier);
            layer.y(currentOffsetY * multiplier);
        });
        
        stage.batchDraw();
        animationFrame = null;
    }
};

const startParallaxAnimation = () => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    updateParallaxOffset();
};

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    
    if (['w', 'a', 's', 'd'].includes(key)) {
        event.preventDefault();

        if (!pressedKeys.has(event.key)) {
            pressedKeys.add(event.key);
            

            const { offsetX, offsetY } = calculateTargetOffset();
            targetOffsetX = offsetX;
            targetOffsetY = offsetY;

            startParallaxAnimation();
        }
    }
})

document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    
    if (['w', 'a', 's', 'd'].includes(key)) {
        if (pressedKeys.has(event.key)) {
            pressedKeys.delete(event.key);
            
            const { offsetX, offsetY } = calculateTargetOffset();
            targetOffsetX = offsetX;
            targetOffsetY = offsetY;
            
            startParallaxAnimation();
        }
    }
})

let useNewTouchLayer = false;

const stopChars = ["！", "？", "。"]

let isCtrlPressed = false;

const getSpeedMultiplier = () => {
    return isCtrlPressed ? 4 : 1;
}

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey) {
        if (getIsFinished()) {
            isCtrlPressed = true;
        }
    }
});

document.addEventListener("keyup", (event) => {
    if (!event.ctrlKey && !event.metaKey) {
        isCtrlPressed = false;
    }
});

let currentBox = null;
let oldBox = null;
const makeCurrentBoxBorder = () => {
    if (oldBox) {
        oldBox.to({
            strokeWidth: 0,
            duration: 0.2 / getSpeedMultiplier()
        });
    }
    currentBox.to({
        strokeWidth: 2,
        stroke: "#fff",
        duration: isCtrlPressed ? 0 : 0.2
    });
    oldBox = currentBox;
}

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TextBox = (x, y, width, name, texts, textColor, bgColor, textDuration = 40) => {
    // 预计算text的尺寸
    const tempText = new Konva.Text({
        text: texts.join(''),
        fontSize: 16,
        lineHeight: 1.5,
        width: width,
        padding: 10,
    });
    const textHeight = tempText.height();
    const textWidth = width;
    
    let textBoxX = x;
    let textBoxY = y;
    
    if (textBoxX === null || textBoxY === null) {
        if (gameBoxes[name] && gameBoxes[name].textAndImageBoxes && gameBoxes[name].textAndImageBoxes.length > 0) {
            const lastBox = gameBoxes[name].textAndImageBoxes[gameBoxes[name].textAndImageBoxes.length - 1];
            const margin = 20;
            
            // 基于上一个box计算新位置，添加边距
            let candidateX = lastBox.x() + random(0, 40) - 20
            let candidateY = lastBox.y() + lastBox.height() + margin + random(0, 10) - 5;
            // 确保不超出边界，如果超出就设置全新坐标
            if (candidateX + textWidth + margin > gameWidth || 
                candidateY + textHeight + margin > gameHeight ||
                candidateX < margin || 
                candidateY < margin) {
                // 超出边界时设置全新的随机坐标
                candidateX = random(margin, gameWidth - textWidth - margin);
                candidateY = random(margin, gameHeight - textHeight - margin);
            }
            
            textBoxX = candidateX;
            textBoxY = candidateY;
        } else {
            textBoxX = random(20, gameWidth - textWidth - 40);
            textBoxY = random(20, gameHeight - textHeight - 40);
        }
    }
    
    // 确保最终位置不超出边界
    textBoxX = Math.max(20, Math.min(textBoxX, gameWidth - textWidth - 40));
    textBoxY = Math.max(20, Math.min(textBoxY, gameHeight - textHeight - 40));
    const text = new Konva.Text({
        x: textBoxX,
        y: textBoxY,
        text: texts[0].split("")[0],
        fontSize: 16,
        fill: textColor,
        lineHeight: 1.5,
        width: width,
        padding: 10,
    })

    return new Promise((resolve) => {
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isAnimating = false;
        let resolved = false;

        text.text("");
        textLayer.add(text);

        const rect = new Konva.Rect({
            x: textBoxX,
            y: textBoxY,
            width: 20,
            height: 20,
            fill: bgColor,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: { x: 2, y: 2 },
            shadowOpacity: 0.3,
        });
        currentBox = rect
        textLayer.add(rect);
        makeCurrentBoxBorder();
        rect.moveToBottom();

        rect.moveToTop();
        text.moveToTop();

        // Store original click handlers for timeline collapse/expand functionality
        const originalRectClickHandler = (evt) => {
            if (rect.opacity() == 0) {
                // Don't handle the click, but don't prevent event propagation
                return;
            }
            rect.moveToTop();
            text.moveToTop();
            currentBox = rect;
            makeCurrentBoxBorder();
        };

        const originalTextClickHandler = (evt) => {
            if (text.opacity() == 0) {
                // Don't handle the click, but don't prevent event propagation
                return;
            }
            rect.moveToTop();
            text.moveToTop();
            currentBox = rect;
            makeCurrentBoxBorder();
        };

        // Store handlers in the elements for later retrieval
        rect._originalClickHandler = originalRectClickHandler;
        text._originalClickHandler = originalTextClickHandler;

        gameBoxes[name].textAndImageBoxes.push(rect);
        gameBoxes[name].textAndImageBoxes.push(text);

        rect.to({
            width: width,
            height: text.height(),
            duration: 0.2 / getSpeedMultiplier()
        });
        
        rect.on("click", originalRectClickHandler);
        text.on("click", originalTextClickHandler);

        function typeText(str, onFinish) {
            isAnimating = true;
            text.text("");
            currentCharIndex = 0;

            const speedMultiplier = getSpeedMultiplier();
            const baseInterval = textDuration / speedMultiplier;

            let charsPerStep = 1;
            let drawInterval = 1;

            if (speedMultiplier > 1) {
                if (str.length > 1000) {
                    charsPerStep = Math.max(8, Math.floor(speedMultiplier * 2));
                    drawInterval = 3;
                } else if (str.length > 500) {
                    charsPerStep = Math.max(5, Math.floor(speedMultiplier * 1.5));
                    drawInterval = 2;
                } else if (str.length > 200) {
                    charsPerStep = Math.max(3, Math.floor(speedMultiplier));
                    drawInterval = 2;
                } else {
                    charsPerStep = Math.max(2, Math.floor(speedMultiplier * 0.8));
                    drawInterval = 1;
                }
            }

            let stepCount = 0;

            function showNextChar() {
                if (currentCharIndex < str.length) {
                    const endIndex = Math.min(currentCharIndex + charsPerStep, str.length);
                    text.text(str.slice(0, endIndex));
                    currentCharIndex = endIndex;
                    stepCount++;

                    // if (stepCount % drawInterval === 0) {
                    //     textLayer.batchDraw();
                    // }

                    setTimeout(showNextChar, baseInterval);
                } else {
                    text.text(str);
                    // textLayer.batchDraw();
                    isAnimating = false;
                    if (onFinish) onFinish();
                }
            }
            showNextChar();
        }

        function updateRectHeight() {
            rect.to({
                height: text.height(),
                duration: 0.2 / getSpeedMultiplier()
            });
        }

        text.on("textChange", updateRectHeight);

        function playNextText() {
            typeText(texts[currentTextIndex], () => {
                updateRectHeight();
                if (currentTextIndex === texts.length - 1) {
                    if (!resolved) {
                        resolved = true;
                        resolve([rect, text]);
                    }
                } else if (isCtrlPressed) {
                    currentTextIndex++;
                    text.text("");
                    setTimeout(() => playNextText(), textDuration / getSpeedMultiplier());
                }
            });
        }

        playNextText();

        if (texts.length > 1) {
            const multiTextRectClickHandler = () => {
                if (resolved) {
                    return
                }
                if (isAnimating) return;
                if (isCtrlPressed) return;

                currentTextIndex++;
                if (currentTextIndex < texts.length) {
                    currentBox = rect;
                    makeCurrentBoxBorder();
                    text.text("");
                    playNextText();
                }
            };

            const multiTextTextClickHandler = () => {
                if (resolved) {
                    return
                }
                rect.fire("click");
            };

            // Store additional handlers
            rect._multiTextClickHandler = multiTextRectClickHandler;
            text._multiTextClickHandler = multiTextTextClickHandler;

            rect.on("click", multiTextRectClickHandler);
            text.on("click", multiTextTextClickHandler);
        } else {
            const singleTextRectClickHandler = () => {
                if (resolved) {
                    return
                }
                if (!isAnimating) {
                    resolved = true;
                    resolve([rect, text]);
                }
            };

            const singleTextTextClickHandler = () => {
                if (resolved) {
                    return
                }
                if (!isAnimating) {
                    resolved = true;
                    resolve([rect, text]);
                }
            };

            // Store additional handlers
            rect._singleTextClickHandler = singleTextRectClickHandler;
            text._singleTextClickHandler = singleTextTextClickHandler;

            rect.on("click", singleTextRectClickHandler);
            text.on("click", singleTextTextClickHandler);
        }
    });
}

const TextBotWithOptions = (x, y, width, name, texts, options, textColor, bgColor, optionColor, textDuration = 40) => {
    const text = new Konva.Text({
        x: x,
        y: y,
        text: texts[0].split("")[0],
        fontSize: 16,
        fill: textColor,
        lineHeight: 1.5,
        width: width,
        padding: 10,
    });

    return new Promise((resolve) => {
        let currentTextIndex = 0;
        let currentCharIndex = 0;
        let isAnimating = false;
        let optionBlocks = [];
        let resolved = false;

        text.text("");
        textLayer.add(text);

        const rect = new Konva.Rect({
            x: x,
            y: y,
            width: 20,
            height: 20,
            fill: bgColor,
        });
        textLayer.add(rect);
        currentBox = rect;
        makeCurrentBoxBorder();
        rect.moveToBottom();
        
        // Store original click handlers for timeline collapse/expand functionality
        const originalRectClickHandler = (evt) => {
            if (rect.opacity() == 0) {
                // Don't handle the click, but don't prevent event propagation
                return;
            }
            rect.moveToTop();
            text.moveToTop();
            currentBox = rect;
            makeCurrentBoxBorder();
        };

        const originalTextClickHandler = (evt) => {
            if (text.opacity() == 0) {
                // Don't handle the click, but don't prevent event propagation
                return;
            }
            rect.moveToTop();
            text.moveToTop();
            currentBox = rect;
            makeCurrentBoxBorder();
        };

        // Store handlers in the elements for later retrieval
        rect._originalClickHandler = originalRectClickHandler;
        text._originalClickHandler = originalTextClickHandler;

        gameBoxes[name].textAndImageBoxes.push(rect);
        gameBoxes[name].textAndImageBoxes.push(text);

        rect.to({
            width: width,
            height: text.height(),
            duration: 0.2 / getSpeedMultiplier()
        });

        function typeText(str, onFinish) {
            isAnimating = true;
            text.text("");
            currentCharIndex = 0;
            
            const speedMultiplier = getSpeedMultiplier();
            const baseInterval = textDuration / speedMultiplier;
            
            let charsPerStep = 1;
            let drawInterval = 1;
            
            if (speedMultiplier > 1) {
                if (str.length > 1000) {
                    charsPerStep = Math.max(8, Math.floor(speedMultiplier * 2));
                    drawInterval = 3;
                } else if (str.length > 500) {
                    charsPerStep = Math.max(5, Math.floor(speedMultiplier * 1.5));
                    drawInterval = 2;
                } else if (str.length > 200) {
                    charsPerStep = Math.max(3, Math.floor(speedMultiplier));
                    drawInterval = 2;
                } else {
                    charsPerStep = Math.max(2, Math.floor(speedMultiplier * 0.8));
                    drawInterval = 1;
                }
            }
            
            let stepCount = 0;
            
            function showNextChar() {
                if (currentCharIndex < str.length) {
                    const endIndex = Math.min(currentCharIndex + charsPerStep, str.length);
                    text.text(str.slice(0, endIndex));
                    currentCharIndex = endIndex;
                    stepCount++;
                    
                    // if (stepCount % drawInterval === 0) {
                    //     textLayer.batchDraw();
                    // }
                    
                    setTimeout(showNextChar, baseInterval);
                } else {
                    text.text(str);
                    // textLayer.batchDraw();
                    isAnimating = false;
                    if (onFinish) onFinish();
                }
            }
            showNextChar();
        }

        function updateRectHeight(extraHeight = 0) {
            rect.to({
                height: text.height() + extraHeight,
                duration: 0.2
            });
        }

        text.on("textChange", () => updateRectHeight(optionBlocks.length > 0 ? getOptionsTotalHeight() : 0));

        function getOptionsTotalHeight() {
            let total = 0;
            for (let block of optionBlocks) {
                total += block.height() + 10;
            }
            return total;
        }

        function showOptions() {
            for (let block of optionBlocks) {
                block.destroy();
            }
            optionBlocks = [];

            let optionY = y + text.height();
            let userOption = null;

            options.forEach((opt, idx) => {
                const optText = new Konva.Text({
                    x: x + 20,
                    y: optionY,
                    text: opt,
                    fontSize: text.fontSize(),
                    fontFamily: text.fontFamily(),
                    fill: optionColor,
                    width: width - 20,
                    height: 20,
                    align: text.align(),
                    opacity: 0,
                    listening: true
                });

                optText.to({
                    opacity: 1,
                    duration: 0.3 / getSpeedMultiplier(),
                    easing: Konva.Easings.EaseInOut
                });

                optText.on("mouseenter", () => {
                    document.body.style.cursor = "pointer";
                    optText.to({ fill: Konva.Util.getRandomColor ? Konva.Util.getRandomColor() : "#fff", duration: 0.1 / getSpeedMultiplier() });
                });
                optText.on("mouseleave", () => {
                    document.body.style.cursor = "default";
                    optText.to({ fill: optionColor, duration: 0.1 / getSpeedMultiplier() });
                });

                optText.on("click", () => {
                    if (resolved) return;
                    userOption = idx;
                    for (let block of optionBlocks) {
                        block.off("click");
                        block.off("mouseenter");
                        block.off("mouseleave");
                    }
                    optText.to({ fill: "#333", duration: 0.15 / getSpeedMultiplier() });
                    setTimeout(() => {
                        for (let block of optionBlocks) {
                            block.destroy();
                        }
                        optionBlocks = [];
                        if (!resolved) {
                            resolved = true;
                            rect.to({
                                height: text.height(),
                                duration: 0.2 / getSpeedMultiplier(),
                                onFinish: () => {
                                    resolve([rect, text, userOption]);
                                }
                            });
                        }
                    }, 180 / getSpeedMultiplier());
                });

                textLayer.add(optText);
                optionBlocks.push(optText);

                optionY += optText.height() + 10;
            });

            updateRectHeight(getOptionsTotalHeight());
        }

        function playNextText() {
            typeText(texts[currentTextIndex], () => {
                updateRectHeight();
                if (currentTextIndex === texts.length - 1) {
                    showOptions();
                } else if (isCtrlPressed) {
                    currentTextIndex++;
                    text.text("");
                    setTimeout(() => playNextText(), textDuration / getSpeedMultiplier());
                }
            });
        }

        playNextText();

        if (texts.length > 1) {
            const multiTextRectClickHandler = () => {
                if (resolved) return;
                if (isAnimating) return;
                if (isCtrlPressed) return;
                
                currentTextIndex++;
                if (currentTextIndex < texts.length) {
                    text.text("");
                    playNextText();
                }
            };

            const multiTextTextClickHandler = () => {
                if (resolved) return;
                currentBox = rect;
                makeCurrentBoxBorder();
                rect.fire("click");
            };

            // Store additional handlers
            rect._multiTextClickHandler = multiTextRectClickHandler;
            text._multiTextClickHandler = multiTextTextClickHandler;

            rect.on("click", originalRectClickHandler);
            rect.on("click", multiTextRectClickHandler);
            text.on("click", originalTextClickHandler);
            text.on("click", multiTextTextClickHandler);
        } else {
            const singleTextRectClickHandler = () => {
                if (resolved) return;
                if (!isAnimating && optionBlocks.length === 0) {
                    showOptions();
                }
            };

            const singleTextTextClickHandler = () => {
                if (resolved) return;
                if (!isAnimating && optionBlocks.length === 0) {
                    showOptions();
                }
            };

            // Store additional handlers
            rect._singleTextClickHandler = singleTextRectClickHandler;
            text._singleTextClickHandler = singleTextTextClickHandler;

            rect.on("click", originalRectClickHandler);
            rect.on("click", singleTextRectClickHandler);
            text.on("click", originalTextClickHandler);
            text.on("click", singleTextTextClickHandler);
        }
    });
}

// const TouchCircleAndTime = (x, y, fillColor, name, onTouch) => {
//     return new Promise((resolve) => {
//         const timeLineRect = new Konva.Rect({
//             x: 0,
//             y: timeStartY,
//             width: 30,
//             height: 30,
//             fill: fillColor,
//             opacity: 0.25,
//         })
//         textLayer.add(timeLineRect);
//         timeStartY += 50;

//         const touchCircle = new Konva.Circle({
//             x: x,
//             y: y,
//             radius: 16,
//             fill: fillColor,
//             opacity: 0.5,
//             shadowColor: fillColor,
//             shadowBlur: 0,
//             shadowOffset: { x: 0, y: 0 },
//             shadowOpacity: 0.8,
//         });

//         function glowAnimation() {
//             let growing = true;
//             let blur = 0;
//             const maxBlur = 32;
//             const minBlur = 8;
//             const step = 0.75;

//             touchCircle.glowAnim = new Konva.Animation((frame) => {
//                 if (growing) {
//                     blur += step;
//                     if (blur >= maxBlur) {
//                         blur = maxBlur;
//                         growing = false;
//                     }
//                 } else {
//                     blur -= step;
//                     if (blur <= minBlur) {
//                         blur = minBlur;
//                         growing = true;
//                     }
//                 }
//                 touchCircle.shadowBlur(blur);
//             }, touchCircle.getLayer());
//             touchCircle.glowAnim.start();
//         }
//         glowAnimation();
//         touchLayer.add(touchCircle);
//         touchCircle.moveToTop();
//         touchCircle.on("mouseover", () => {
//             if (clicked) return;
//             document.body.style.cursor = "pointer";
//         })
//         touchCircle.on("mouseout", () => {
//             if (clicked) return;
//             document.body.style.cursor = "default";
//         })
//         let clicked = false;
//         touchCircle.on("click", () => {
//             if (clicked) return;
//             clicked = true;
//             const fadeOut = (node, duration = 200, opacity = 0) => {
//                 return new Promise((resolve) => {
//                     node.to({
//                         opacity: opacity,
//                         duration: (duration / 1000) / getSpeedMultiplier(),
//                         onFinish: resolve
//                     });
//                 });
//             };
            

//             fadeOut(touchCircle, 200)
//             .then(() => fadeOut(touchLayer, 200, 0.5))
//             .then(() => {
//                 return onTouch();
//             })
//             .then(() => {
//                 resolve();
//             });
//         })
//         gameBoxes[name] = {
//             hidden: false,
//             touchCircle: touchCircle,
//             timeLineRect: timeLineRect,
//             textAndImageBoxes: [],
//             onTouch: onTouch
//         }
//     });
// }

const TouchCircleNewWindowKeep = (x, y, fillColor, name, link, onClick = null) => {
    let newWindow = null;
    const timeLineRect = new Konva.Rect({
        x: 0,
        y: timeStartY,
        width: useNewTouchLayer ? 140 : 120,
        height: 30,
        fill: fillColor,
        opacity: 0.25,
        shadowColor: 'black',
        shadowBlur: 3,
        shadowOffset: { x: 2, y: 2 },
        shadowOpacity: 0.3,
    })
    const shouldThisUseNewTouchLayer = useNewTouchLayer;
    if (useNewTouchLayer) {
        newTouchLayer.add(timeLineRect);
    } else {
        touchLayer.add(timeLineRect);
    }

    if (timeLineRect.y() + 30 + 50 > height - 50) {
        useNewTouchLayer = true;
        timeStartY = 65;
    } else {
        timeStartY += 50;
    }
    const touchCircle = new Konva.Circle({
        x: x,
        y: y,
        radius: 16,
        fill: 'transparent',
        stroke: fillColor,
        strokeWidth: 4,
        opacity: 1,
        shadowColor: fillColor,
        shadowBlur: 0,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 1,
    });


    const innerCircle = new Konva.Circle({
        x: x,
        y: y,
        radius: 6,
        fill: fillColor,
        opacity: 1,
        shadowColor: fillColor,
        shadowBlur: 0,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 1,
    });

    const fadeIn = (node, duration = 200, targetOpacity = 1) => {
        return new Promise((resolve) => {
            node.to({
                opacity: targetOpacity,
                duration: (duration / 1000) / getSpeedMultiplier(),
                onFinish: resolve
            });
        });
    };

    function glowAnimation() {
        let growing = true;
        let blur = 0;
        const maxBlur = 16;
        const minBlur = 4;
        const step = 0.75;

        touchCircle.glowAnim = new Konva.Animation((frame) => {
            if (growing) {
                blur += step;
                if (blur >= maxBlur) {
                    blur = maxBlur;
                    growing = false;
                }
            } else {
                blur -= step;
                if (blur <= minBlur) {
                    blur = minBlur;
                    growing = true;
                }
            }
            touchCircle.shadowBlur(blur);
            // 内圆也参与发光动画，但强度稍弱
            innerCircle.shadowBlur(blur * 0.6);
        }, touchCircle.getLayer());
        touchCircle.glowAnim.start();
    }
    glowAnimation();
    touchLayer.add(touchCircle);
    touchLayer.add(innerCircle);
    touchCircle.on("mouseover", () => {
        document.body.style.cursor = "pointer";
    })
    innerCircle.on("mouseover", () => {
        document.body.style.cursor = "pointer";
    })
    touchCircle.on("mouseout", () => {
        document.body.style.cursor = "default";
    })
    innerCircle.on("mouseout", () => {
        document.body.style.cursor = "default";
    })
    innerCircle.on("click", () => {
        if (onClick) {
            onClick()
        }
        if (newWindow) {
            // check location
            if (newWindow.location.href) {
                newWindow.focus()
            } else {
                newWindow = window.open(link, `newGame-${link}`, `width=${width},height=${height}`)
            }

            return
        }
        newWindow = window.open(link, `newGame-${link}`, `width=${width},height=${height}`)
    })
    touchCircle.on("click", () => {
        if (newWindow) {
            // check location
            if (newWindow.location.href) {
                newWindow.focus()
            } else {
                newWindow = window.open(link, `newGame-${link}`, `width=${width},height=${height}`)
            }
            
            return
        }
        newWindow = window.open(link, `newGame-${link}`, `width=${width},height=${height}`)
    });
    timeLineRect.on("mouseover", () => {
        document.body.style.cursor = "pointer";
    })
    timeLineRect.on("mouseout", () => {
        document.body.style.cursor = "default";
    })
        let isAnimating = false;
        timeLineRect.on("click", (info) => {
            const oldState = gameBoxes[name].hidden;
            const newState = !oldState;
            gameBoxes[name].hidden = newState;
            gameBoxes[name].timeLineRect.to({
                opacity: newState ? 0.25 : gameBoxes[name].isFinished ? 1 : 0.25,
                width: newState ? shouldThisUseNewTouchLayer ? 50 : 30 : shouldThisUseNewTouchLayer ? 140 : 120,
                duration: 0.2 / getSpeedMultiplier()
            });
            gameBoxes[name].textAndImageBoxes.forEach(box => {
                box.to({
                    opacity: newState ? 0 : 1,
                    duration: 0.2 / getSpeedMultiplier()
                });
                
                // If collapsing (newState = true), disable pointer events to allow click-through
                if (newState) {
                    // Disable listening for pointer events so clicks pass through to elements below
                    box.listening(false);
                } else {
                    // If expanding (newState = false), re-enable pointer events
                    box.listening(true);
                }
            });
        })
        gameBoxes[name] = {
            hidden: false,
            touchCircle: touchCircle,
            timeLineRect: timeLineRect,
            textAndImageBoxes: [],
            isFinished: false,
            shouldThisUseNewTouchLayer: shouldThisUseNewTouchLayer
        }
    return touchCircle;
}

const TouchCircleAndTime = (x, y, fillColor, name, onTouch) => {
    return new Promise((resolve) => {
        const timeLineRect = new Konva.Rect({
            x: 0,
            y: timeStartY,
            width: useNewTouchLayer ? 140 : 120,
            height: 30,
            fill: fillColor,
            opacity: 0.25,
            shadowColor: 'black',
            shadowBlur: 3,
            shadowOffset: { x: 2, y: 2 },
            shadowOpacity: 0.3,
        })
        const shouldThisUseNewTouchLayer = useNewTouchLayer;
        if (useNewTouchLayer) {
            newTouchLayer.add(timeLineRect);
        } else {
            touchLayer.add(timeLineRect);
        }
        
        if (timeLineRect.y() + 30 + 50 > height - 50) {
            useNewTouchLayer = true;
            timeStartY = 65;
        } else {
            timeStartY += 50;
        }

        const touchCircle = new Konva.Circle({
            x: x,
            y: y,
            radius: 16,
            fill: fillColor,
            opacity: 1,
            shadowColor: fillColor,
            shadowBlur: 0,
            shadowOffset: { x: 0, y: 0 },
            shadowOpacity: 1,
        });
        
        const fadeIn = (node, duration = 200, targetOpacity = 1) => {
            return new Promise((resolve) => {
                node.to({
                    opacity: targetOpacity,
                    duration: (duration / 1000) / getSpeedMultiplier(),
                    onFinish: resolve
                });
            });
        };

        function glowAnimation() {
            let growing = true;
            let blur = 0;
            const maxBlur = 32;
            const minBlur = 8;
            const step = 0.75;

            touchCircle.glowAnim = new Konva.Animation((frame) => {
                if (growing) {
                    blur += step;
                    if (blur >= maxBlur) {
                        blur = maxBlur;
                        growing = false;
                    }
                } else {
                    blur -= step;
                    if (blur <= minBlur) {
                        blur = minBlur;
                        growing = true;
                    }
                }
                touchCircle.shadowBlur(blur);
            }, touchCircle.getLayer());
            touchCircle.glowAnim.start();
        }
        glowAnimation();
        touchLayer.add(touchCircle);
        touchCircle.on("mouseover", () => {
            document.body.style.cursor = "pointer";
        })
        touchCircle.on("mouseout", () => {
            document.body.style.cursor = "default";
        })
        let clicked = false;
        touchCircle.on("click", () => {
            if (clicked) return;
            clicked = true;
            touchCircle.destroy();
            const fadeOut = (node, duration = 200, opacity = 0) => {
                return new Promise((resolve) => {
                    node.to({
                        opacity: opacity,
                        duration: (duration / 1000) / getSpeedMultiplier(),
                        onFinish: resolve
                    });
                });
            };


            fadeOut(touchCircle, 200)
                .then(() => {
                    return onTouch();
                })
                .then(() => {
                    resolve();
                });
        })
        timeLineRect.on("mouseover", () => {
            document.body.style.cursor = "pointer";
        })
        timeLineRect.on("mouseout", () => {
            document.body.style.cursor = "default";
        })
        let isAnimating = false;
        timeLineRect.on("click", (info) => {
            if (info.evt.shiftKey) {
                if (gameBoxes[name].isFinished && gameBoxes[name].hidden) {
                    if (isAnimating) return;
                    isAnimating = true;

                    const oldState = gameBoxes[name].hidden;
                    const newState = !oldState;
                    gameBoxes[name].hidden = newState;
                    Promise.all([
                        timeLineRect.to({
                            opacity: 1,
                            width: shouldThisUseNewTouchLayer ? 140 : 120,
                            duration: 0.2 / getSpeedMultiplier()
                        }),
                        ClearBoxesAndImages(name, 0.2 / getSpeedMultiplier())
                    ]).then(() => {
                        isAnimating = false;
                    }).then(() => {
                        if (typeof onTouch === "function") {
                            onTouch()
                                .then(() => {
                                    isAnimating = false;
                                    // After recreating content, restore pointer events for new elements
                                    gameBoxes[name].textAndImageBoxes.forEach(box => {
                                        box.listening(true);
                                    });
                                })
                                .catch((e) => {
                                    isAnimating = false;
                                    console.error(e);
                                });
                        }
                    });
                } else {
                    return;
                }
            }
            const oldState = gameBoxes[name].hidden;
            const newState = !oldState;
            gameBoxes[name].hidden = newState;
            gameBoxes[name].timeLineRect.to({
                opacity: newState ? 0.25 : gameBoxes[name].isFinished ? 1 : 0.25,
                width: newState ? shouldThisUseNewTouchLayer ? 50 : 30 : shouldThisUseNewTouchLayer ? 140 : 120,
                duration: 0.2 / getSpeedMultiplier()
            });
            
            // Handle click events for TextBox elements
            gameBoxes[name].textAndImageBoxes.forEach(box => {
                box.to({
                    opacity: newState ? 0 : 1,
                    duration: 0.2 / getSpeedMultiplier()
                });
                
                // If collapsing (newState = true), disable pointer events to allow click-through
                if (newState) {
                    // Disable listening for pointer events so clicks pass through to elements below
                    box.listening(false);
                } else {
                    // If expanding (newState = false), re-enable pointer events
                    box.listening(true);
                }
            });
        })
        gameBoxes[name] = {
            hidden: false,
            touchCircle: touchCircle,
            timeLineRect: timeLineRect,
            textAndImageBoxes: [],
            isFinished: false,
            shouldThisUseNewTouchLayer: shouldThisUseNewTouchLayer
        }
    });
}

const JustLayer = (name, functions) => {
    gameBoxes[name] = {
        textAndImageBoxes: []
    }
    return functions()
        .then(() => {
            return new Promise((r) => r())
        })
}

const FinishTimeLine = (name) => {
    gameBoxes[name].isFinished = true;
    gameBoxes[name].timeLineRect.to({
        opacity: 1,
        width: gameBoxes[name].shouldThisUseNewTouchLayer ? 140 : 120,
        duration: 0.2 / getSpeedMultiplier(),
        onFinish: () => {
            localStorage.setItem(`chapter-${name}`, true)
            const randomNumber = Math.random()
            localStorage.setItem(`i-finished-${randomNumber}`, name)
        }
    });
    
}

const FinishLayer = (name) => {
    localStorage.setItem(`chapter-${name}`, true)
    const randomNumber = Math.random()
    localStorage.setItem(`202i-finished-${randomNumber}`, name)
}

// delete all 202i-
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("202i-")) {
        localStorage.removeItem(key)
    }
}

window.addEventListener("storage", (e) => {
    if (e.key.startsWith("202i-finished-")) {
        console.log(localStorage.getItem(e.key))
        const chapter = localStorage.getItem(e.key)
        if (chapter in gameBoxes) {
            if ("timeLineRect" in gameBoxes[chapter]) {
                gameBoxes[chapter].isFinished = true;
                gameBoxes[chapter].timeLineRect.to({
                    opacity: 1,
                    width: gameBoxes[chapter].shouldThisUseNewTouchLayer ? 140 : 120,
                    duration: 0.2 / getSpeedMultiplier(),
                });
                
            }
            localStorage.removeItem(e.key)
        }
    }
})


const EnterImage = (x, y, width, height, name, imageSrc, duration = 1000, opacity = 1, others = {}) => {
    return new Promise((resolve) => {
        const image = new Image();
        const createKonvaImage = (image_, x_, y_, width_, height_) => {
            const background = new Konva.Image({
                image: image_,
                x: x_,
                y: y_,
                width: width_,
                height: height_,
                opacity: 0,
                ...others
            });
            return background;
        }
        
        image.onload = () => {
            const imgWidth = image.width;
            const imgHeight = image.height;
            const konvaImage = createKonvaImage(image, x, y, width || imgWidth, height || imgHeight);
            gameBoxes[name].textAndImageBoxes.push(konvaImage);
            
            imageLayer.add(konvaImage);
            // imageLayer.batchDraw();

            konvaImage.to({
                opacity: opacity,
                duration: (duration / 1000) / getSpeedMultiplier(),
                onFinish: () => {
                    // imageLayer.batchDraw();
                    resolve(konvaImage);
                }
            });
        }
        image.src = imageSrc;
    });
}

const EnterImageLikeBG = (name, imageSrc, duration = 1000, opacity = 1, others = {}) => {
    return new Promise((resolve) => {
        const image = new Image();
        const createKonvaImage = (image_, x_, y_, width_, height_) => {
            
            const background = new Konva.Image({
                image: image_,
                x: x_,
                y: y_,
                width: width_,
                height: height_,
                opacity: 0,
                ...others
            });
            return background;
        }

        image.onload = () => {
            const scale = 1680 / image.naturalWidth;
            const imgHeight = image.naturalHeight * scale;
            const konvaImage = createKonvaImage(image, 0, (gameHeight - imgHeight) / 2, 1680, imgHeight);
            gameBoxes[name].textAndImageBoxes.push(konvaImage);

            imageLayer.add(konvaImage);
            // imageLayer.batchDraw();

            konvaImage.to({
                opacity: opacity,
                duration: (duration / 1000) / getSpeedMultiplier(),
                onFinish: () => {
                    // imageLayer.batchDraw();
                    resolve(konvaImage);
                }
            });
        }
        image.src = imageSrc;
    });
}

const ExitImage = (name, image, duration = 1000) => {
    return new Promise((resolve) => {
        image.to({
            opacity: 0,
            duration: (duration / 1000) / getSpeedMultiplier(),
            onFinish: () => {
                const idx = gameBoxes[name].textAndImageBoxes.indexOf(image);
                if (idx !== -1) {
                    gameBoxes[name].textAndImageBoxes.splice(idx, 1);
                }
                image.destroy();
                // imageLayer.batchDraw();
                resolve();
            }
        });
    });
}

const shakeLevels = {
    low: {
        translateY: [0, 5, 0, -5, 0],
        translateX: [0, 2, 0, -3, 0],
    },
    medium: {
        translateY: [0, 10, 0, -10, 0],
        translateX: [0, 5, 0, -6, 0],
    },
    high: {
        translateY: [0, 15, 0, -15, 0],
        translateX: [0, 7, 0, -8, 0],
    }
}

const ShakeImage = (image, shakeLevel, times, duration = 1000) => {
    return new Promise((resolve) => {
        const level = shakeLevel in shakeLevels ? shakeLevels[shakeLevel] : shakeLevels.low;
        const keyframes = [];
        for (let t = 0; t < times; t++) {
            for (let i = 0; i < level.translateX.length; i++) {
                keyframes.push({
                    x: level.translateX[i],
                    y: level.translateY[i]
                });
            }
        }
        keyframes.push({
            x: 0,
            y: 0
        });

        const singleShakeFrames = level.translateX.length;
        const totalFrames = keyframes.length;
        const singleShakeDuration = duration / times;
        const frameDuration = singleShakeDuration / singleShakeFrames;

        let frameIndex = 0;

        function animateFrame() {
            if (frameIndex < keyframes.length) {
                image.to({
                    offsetX: keyframes[frameIndex].x,
                    offsetY: keyframes[frameIndex].y,
                    duration: (frameDuration / 1000) / getSpeedMultiplier(),
                    onFinish: () => {
                        frameIndex++;

                        animateFrame();
                    }
                });
            } else {
                resolve();
            }
        }
        animateFrame();
    });
}

const SkewImage = (image, skewX, skewY, duration = 1000) => {
    return new Promise((resolve) => {
        image.to({
            skewX: skewX,
            skewY: skewY,
            duration: (duration / 1000) / getSpeedMultiplier(),
            onFinish: resolve
        });
    });
}

const MoveImage = (image, x, y, duration = 1000) => {
    if (duration === 0) {
        image.x(x);
        image.y(y);
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        image.to({
            x: x,
            y: y,
            duration: (duration / 1000) / getSpeedMultiplier(),
            onFinish: resolve
        });
    });
}

const ChangeImage = (image, newImageSrc, width, height, duration = 1000, opacity = 1, others = {}) => {
    if (duration === 0) {
        const newImage = new Image();
        newImage.onload = () => {
            image.image(newImage);
            if (width !== undefined && height !== undefined) {
                image.width(width);
                image.height(height);
            }
        }
        newImage.src = newImageSrc;
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
            image.to({
                opacity: 0,
                duration: duration / 2000,
                onFinish: () => {
                    image.image(img);
                    if (width !== undefined && height !== undefined) {
                        image.width(width);
                        image.height(height);
                    }
                    image.to({
                        opacity: opacity,
                        ...others,
                        duration: duration / 2000,
                        onFinish: resolve
                    });
                }
            });
        };
        img.src = newImageSrc;
    });
}

const Background = (imageSrc, duration = 1000) => {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            const scale = 1680 / image.naturalWidth;
            const imgHeight = image.naturalHeight * scale;
            console.log(height, imgHeight);
            const background = new Konva.Image({
                image: image,
                x: 0,
                y: (height - imgHeight) / 2,
                width: 1680,
                height: imgHeight,
                opacity: 0,
            });
            backgroundLayer.add(background);
            background.to({
                opacity: 1,
                duration: (duration / 1000) / getSpeedMultiplier(),
                onFinish: () => {
                    backgroundImage = background;
                    resolve(background);
                }
            });
        }
        image.src = imageSrc;
    });
}

const ChangeBackground = (imageSrc, duration = 1000) => {
    return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
            const scale = width / image.width;
            const imgWidth = image.width * scale;
            const imgHeight = image.height * scale;
            const background = new Konva.Image({
                image: image,
                x: width / 2 - imgWidth / 2,
                y: height / 2 - imgHeight / 2,
                width: imgWidth,
                height: imgHeight,
                opacity: 0,
            });
            backgroundLayer.add(background);
            background.to({
                opacity: 1,
                duration: (duration / 1000) / getSpeedMultiplier(),
                onFinish: () => {
                    backgroundLayer.remove(backgroundImage);
                    backgroundImage.destroy();
                    backgroundImage = background;
                    resolve(background);
                }
            });
        }
        image.src = imageSrc;
    });
}

const WaitForClick = (rect, text) => {
    return new Promise((resolve) => {
        if (isCtrlPressed) {
            resolve([rect, text]);
            return;
        }
        
        // Define the persistent click handlers that will be stored
        const persistentRectClickHandler = (evt) => {
            if (rect.opacity() == 0) {
                // Don't handle the click, but don't prevent event propagation
                return;
            }
            rect.moveToTop();
            text.moveToTop();
            currentBox = rect;
            makeCurrentBoxBorder();
        };

        const persistentTextClickHandler = (evt) => {
            if (text.opacity() == 0) {
                // Don't handle the click, but don't prevent event propagation
                return;
            }
            rect.moveToTop();
            text.moveToTop();
            currentBox = rect;
            makeCurrentBoxBorder();
        };

        // Define the one-time click handlers for resolution
        const oneTimeRectClickHandler = () => {
            rect.off("click", oneTimeRectClickHandler);
            text.off("click", oneTimeTextClickHandler);
            
            // Store the persistent handlers for timeline functionality
            rect._waitForClickHandler = persistentRectClickHandler;
            text._waitForClickHandler = persistentTextClickHandler;
            
            rect.on("click", persistentRectClickHandler);
            text.on("click", persistentTextClickHandler);

            resolve([rect, text]);
        };

        const oneTimeTextClickHandler = () => {
            rect.off("click", oneTimeRectClickHandler);
            text.off("click", oneTimeTextClickHandler);
            
            // Store the persistent handlers for timeline functionality
            rect._waitForClickHandler = persistentRectClickHandler;
            text._waitForClickHandler = persistentTextClickHandler;
            
            rect.on("click", persistentRectClickHandler);
            text.on("click", persistentTextClickHandler);

            resolve([rect, text]);
        };
        
        rect.on("click", oneTimeRectClickHandler);
        text.on("click", oneTimeTextClickHandler);
    });
}

const PlaySound = (soundSrc, volume = 1) => {
    return new Promise((resolve) => {
        const sound = new Audio(soundSrc);
        sound.volume = volume;
        sound.play();
        resolve(sound);
    });
}

const SoundFadeInOrOut = (sound, duration = 1000, targetVolume = 1) => {
    return new Promise((resolve) => {
        if (!sound) {
            resolve();
            return;
        }
        if (duration === 0) {
            sound.volume = Math.round(Math.max(0, Math.min(1, targetVolume)) * 100) / 100;
            resolve();
            return;
        }
        const startVolume = sound.volume;
        const volumeDiff = targetVolume - startVolume;
        const intervalTime = 15; // 每15ms调整一次
        const adjustedDuration = duration / getSpeedMultiplier();
        const steps = Math.max(1, Math.floor(adjustedDuration / intervalTime));
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            let newVolume = startVolume + (volumeDiff * currentStep / steps);
            newVolume = Math.max(0, Math.min(1, newVolume));
            sound.volume = Math.round(newVolume * 100) / 100;
            if (currentStep >= steps) {
                sound.volume = Math.round(Math.max(0, Math.min(1, targetVolume)) * 100) / 100;
                clearInterval(interval);
                resolve();
            }
        }, intervalTime);
    });
}

const PlaySE = (soundSrc, name, volume = 1, loop = false, duration = 0) => {
    return new Promise((resolve) => {
        const sound = new Audio(soundSrc);
        sound.volume = duration > 0 ? 0 : volume;
        sound.loop = loop;
        gameSounds.se[name] = sound;
        sound.play();
        if (duration > 0) {
            SoundFadeInOrOut(sound, duration, volume).then(() => {
                resolve(sound);
            });
        } else {
            resolve(sound);
        }
    });
}

const StopSE = (name) => {
    if (gameSounds.se[name]) {
        SoundFadeInOrOut(gameSounds.se[name], 1000, 0);
        delete gameSounds.se[name];
    }
}

const PlayBGM = (soundSrc, volume = 1, fadeInDuration = 1000) => {
    return new Promise((resolve) => {
        if (gameSounds.bgm) {
            StopBGM();
        }
        const sound = new Audio(soundSrc);
        sound.volume = 0;
        sound.loop = true;
        sound.play();
        gameSounds.bgm = sound;
        SoundFadeInOrOut(sound, fadeInDuration, volume).then(() => {
            resolve(sound);
        });
    });
}

const StopBGM = (fadeOutDuration = 1000) => {
    if (gameSounds.bgm) {
        const oldBgm = gameSounds.bgm;
        SoundFadeInOrOut(oldBgm, fadeOutDuration, 0).then(() => {
            oldBgm.pause();
            oldBgm.currentTime = 0;
            delete gameSounds.bgm;
        });
    }
}

const ChangeBGM = (soundSrc, volume = 1, crossFadeDuration = 1000) => {
    return new Promise((resolve) => {
        const oldBgm = gameSounds.bgm;
        if (!oldBgm) {
            PlayBGM(soundSrc, volume, crossFadeDuration).then(resolve);
            return;
        }
        const newBgm = new Audio(soundSrc);
        newBgm.volume = 0;
        newBgm.loop = true;
        newBgm.play();
        gameSounds.bgm = newBgm;
        let finished = 0;
        const checkFinish = () => {
            finished++;
            if (finished === 2) {
                resolve(newBgm);
            }
        };
        SoundFadeInOrOut(oldBgm, crossFadeDuration, 0).then(() => {
            oldBgm.pause();
            oldBgm.currentTime = 0;
            checkFinish();
        });
        SoundFadeInOrOut(newBgm, crossFadeDuration, volume).then(checkFinish);
    });
}

const WaitForClickImage = (image) => {
    return new Promise((resolve) => {
        if (isCtrlPressed) {
            resolve(image);
            return;
        }
        
        image.on("click", () => {
            image.off("click");
            resolve(image);
        });
    });
}

const Sleep = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration / getSpeedMultiplier());
    });
}

const RemoveRectAndText = (rect, text, duration = 0) => {
    return new Promise((resolve) => {
        text.to({
            opacity: 0,
            duration: (duration / 1000) / getSpeedMultiplier(),
        });
        rect.to({
            opacity: 0,
            duration: (duration / 1000) / getSpeedMultiplier(),
            onFinish: () => {
                rect.destroy();
                text.destroy();
                resolve();
            }
        });
    });
}

const ClearBoxesAndImages = (name, duration = 0) => {
    return new Promise((resolve) => {
        const boxes = gameBoxes[name].textAndImageBoxes;
        if (duration > 0) {
            let finished = 0;
            if (boxes.length === 0) {
                resolve();
                return;
            }
            boxes.forEach(box => {
                if (currentBox === box) {
                    currentBox = null;
                }
                box.to({
                    opacity: 0,
                    duration: (duration / 1000) / getSpeedMultiplier(),
                    onFinish: () => {
                        box.destroy();
                        finished++;
                        if (finished === boxes.length) {
                            gameBoxes[name].textAndImageBoxes = [];
                            resolve();
                        }
                    }
                });
            });
        } else {
            boxes.forEach(box => {
                if (currentBox === box) {
                    currentBox = null;
                }
                box.destroy();
            });
            gameBoxes[name].textAndImageBoxes = [];
            resolve();
        }
    });
}


const Archivement = (img, name, description) => {
    return new Promise((resolve) => {
        const achievementBox = new Konva.Rect({
            x: width - 250,
            y: height - 70,
            width: 240,
            height: 60,
            fill: '#000000',
            opacity: 0,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: { x: 2, y: 2 },
            shadowOpacity: 0.3,
        });

        const image = new Image();
        image.onload = () => {
            const achievementIcon = new Konva.Image({
                image: image,
                x: width - 240,
                y: height - 60,
                width: 40,
                height: 40,
                opacity: 0
            });

            const titleText = new Konva.Text({
                x: width - 190,
                y: height - 57,
                text: name,
                fontSize: 14,
                fontStyle: 'bold',
                fill: '#ffffff',
                width: 175,
                opacity: 0
            });

            const descText = new Konva.Text({
                x: width - 190,
                y: height - 38,
                text: description,
                fontSize: 11,
                fill: '#cccccc',
                width: 175,
                opacity: 0
            });

            textLayer.add(achievementBox);
            textLayer.add(achievementIcon);
            textLayer.add(titleText);
            textLayer.add(descText);

            achievementBox.y(height + 20);
            achievementIcon.y(height + 10);
            titleText.y(height + 13);
            descText.y(height + 32);

            achievementBox.to({
                y: height - 70,
                opacity: 0.9,
                duration: 0.3,
                easing: Konva.Easings.EaseOut
            });

            achievementIcon.to({
                y: height - 60,
                opacity: 1,
                duration: 0.3,
                easing: Konva.Easings.EaseOut
            });

            titleText.to({
                y: height - 57,
                opacity: 1,
                duration: 0.3,
                easing: Konva.Easings.EaseOut
            });

            descText.to({
                y: height - 38,
                opacity: 1,
                duration: 0.3,
                easing: Konva.Easings.EaseOut,
                onFinish: () => {
                    // 显示2秒后开始淡出
                    setTimeout(() => {
                        achievementBox.to({
                            opacity: 0,
                            duration: 0.5
                        });
                        achievementIcon.to({
                            opacity: 0,
                            duration: 0.5
                        });
                        titleText.to({
                            opacity: 0,
                            duration: 0.5
                        });
                        descText.to({
                            opacity: 0,
                            duration: 0.5,
                            onFinish: () => {
                                achievementBox.destroy();
                                achievementIcon.destroy();
                                titleText.destroy();
                                descText.destroy();
                            }
                        });
                    }, 2000);
                }
            });
        };

        image.onerror = () => {
            const achievementIcon = new Konva.Text({
                x: width - 240,
                y: height - 60,
                text: '🏆',
                fontSize: 32,
                fill: '#ffd700',
                width: 40,
                height: 40,
                opacity: 0,
                align: 'center',
                verticalAlign: 'middle'
            });

            const titleText = new Konva.Text({
                x: width - 190,
                y: height - 57,
                text: name,
                fontSize: 14,
                fontStyle: 'bold',
                fill: '#ffffff',
                width: 175,
                opacity: 0
            });

            const descText = new Konva.Text({
                x: width - 190,
                y: height - 38,
                text: description,
                fontSize: 11,
                fill: '#cccccc',
                width: 175,
                opacity: 0
            });

            textLayer.add(achievementBox);
            textLayer.add(achievementIcon);
            textLayer.add(titleText);
            textLayer.add(descText);

            achievementBox.y(height + 20);
            achievementIcon.y(height + 10);
            titleText.y(height + 13);
            descText.y(height + 32);

            achievementBox.to({
                y: height - 70,
                opacity: 0.9,
                duration: 0.3,
                easing: Konva.Easings.EaseOut
            });

            achievementIcon.to({
                y: height - 60,
                opacity: 1,
                duration: 0.3,
                easing: Konva.Easings.EaseOut
            });

            titleText.to({
                y: height - 57,
                opacity: 1,
                duration: 0.3,
                easing: Konva.Easings.EaseOut
            });

            descText.to({
                y: height - 38,
                opacity: 1,
                duration: 0.3,
                easing: Konva.Easings.EaseOut,
                onFinish: () => {
                    setTimeout(() => {
                        achievementBox.to({
                            opacity: 0,
                            duration: 0.5
                        });
                        achievementIcon.to({
                            opacity: 0,
                            duration: 0.5
                        });
                        titleText.to({
                            opacity: 0,
                            duration: 0.5
                        });
                        descText.to({
                            opacity: 0,
                            duration: 0.5,
                            onFinish: () => {
                                achievementBox.destroy();
                                achievementIcon.destroy();
                                titleText.destroy();
                                descText.destroy();
                            }
                        });
                    }, 2000);
                }
            });
        };

        image.src = img;
    });
}


const NewWindow = (link) => {
    return new Promise((resolve) => {
        window.open(link, `newGame-${link}`, `width=${width},height=${height}`)
        resolve()
    })
}

let shakeId = null;
let shakeCount = 0;
let originalX = 0;
let originalY = 0;

const StartShakeAllBoxes = () => {
    return new Promise((resolve) => {
        shakeId = setInterval(() => {
            const keys = Object.keys(gameBoxes);
            keys.forEach(key => {
                if ("textAndImageBoxes" in gameBoxes[key]) {
                gameBoxes[key].textAndImageBoxes.forEach(box => {
                        box.offsetX(Math.random() * 5 - 2.5);
                        box.offsetY(Math.random() * 5 - 2.5);
                    });
                }
            });
        }, 50);
        resolve();
    });
}

const StopShakeAllBoxes = () => {
    return new Promise((resolve) => {
        clearInterval(shakeId);
        shakeId = null;
        shakeCount = 0;
        const keys = Object.keys(gameBoxes);
        keys.forEach(key => {
            if ("textAndImageBoxes" in gameBoxes[key]) {
                gameBoxes[key].textAndImageBoxes.forEach(box => {
                    box.offsetX(0);
                    box.offsetY(0);
                });
            }
        });
        resolve();
    });
}
