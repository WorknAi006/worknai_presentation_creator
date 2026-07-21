import * as fabric from "fabric";

const AnimationEngine = {

    play({ animation, object, canvas, onComplete }) {

        if (!animation || !object || !canvas) {
            onComplete?.();
            return;
        }

        switch (animation.category) {

            case "entrance":
                this.playEntrance({ animation, object, canvas, onComplete });
                break;

            case "exit":
                this.playExit({ animation, object, canvas, onComplete });
                break;

            case "emphasis":
                this.playEmphasis({ animation, object, canvas, onComplete });
                break;

            default:
                onComplete?.();
        }
    },

    playEntrance({ animation, object, canvas, onComplete }) {
        const effect = (animation.type || "").toLowerCase();
        const duration = (animation.duration || 0.5) * 1000;

        switch (effect) {
            case "appear":
                object.set("opacity", 1);
                canvas.requestRenderAll();
                onComplete?.();
                break;

            case "fade":
            case "dissolve-in":
                object.set("opacity", 0);
                fabric.util.animate({
                    startValue: 0, endValue: 1, duration,
                    onChange(value) { object.set("opacity", value); canvas.requestRenderAll(); },
                    onComplete() { object.set("opacity", 1); canvas.requestRenderAll(); onComplete?.(); }
                });
                break;

            case "zoom":
            case "expand":
            case "grow-turn":
                {
                    object.set({ opacity: 0 });
                    const origScaleX = object.scaleX || 1;
                    const origScaleY = object.scaleY || 1;
                    const origAngle = object.angle || 0;
                    fabric.util.animate({
                        startValue: 0, endValue: 1, duration,
                        onChange(value) { 
                            object.set({ 
                                opacity: value, 
                                scaleX: origScaleX * value, 
                                scaleY: origScaleY * value,
                                angle: effect === "grow-turn" ? origAngle + (360 * value) - 360 : origAngle
                            }); 
                            canvas.requestRenderAll(); 
                        },
                        onComplete() { 
                            object.set({ opacity: 1, scaleX: origScaleX, scaleY: origScaleY, angle: origAngle }); 
                            canvas.requestRenderAll(); 
                            onComplete?.(); 
                        }
                    });
                }
                break;

            case "fly":
            case "fly-in":
            case "float-in":
            case "peek-in":
            case "crawl-in":
                this.playFly({ animation, object, canvas, onComplete });
                break;

            default:
                // Fallback for all other entrance animations
                object.set("opacity", 0);
                fabric.util.animate({
                    startValue: 0, endValue: 1, duration,
                    onChange(value) { object.set("opacity", value); canvas.requestRenderAll(); },
                    onComplete() { object.set("opacity", 1); canvas.requestRenderAll(); onComplete?.(); }
                });
        }
    },

    playExit({ animation, object, canvas, onComplete }) {
        const effect = (animation.type || "").toLowerCase();
        const duration = (animation.duration || 0.5) * 1000;

        switch (effect) {
            case "disappear":
                object.set("opacity", 0);
                canvas.requestRenderAll();
                onComplete?.();
                break;
            
            case "zoom-out":
            case "collapse":
            case "shrink-turn":
                {
                    const origScaleX = object.scaleX || 1;
                    const origScaleY = object.scaleY || 1;
                    const origAngle = object.angle || 0;
                    fabric.util.animate({
                        startValue: 1, endValue: 0, duration,
                        onChange(value) { 
                            object.set({ 
                                opacity: value, 
                                scaleX: origScaleX * value, 
                                scaleY: origScaleY * value,
                                angle: effect === "shrink-turn" ? origAngle + (360 * (1 - value)) : origAngle
                            }); 
                            canvas.requestRenderAll(); 
                        },
                        onComplete() { 
                            object.set({ opacity: 0, scaleX: origScaleX, scaleY: origScaleY, angle: origAngle }); 
                            canvas.requestRenderAll(); 
                            onComplete?.(); 
                        }
                    });
                }
                break;

            case "fade-out":
            case "dissolve-out":
            default:
                // Fallback for all other exit animations
                fabric.util.animate({
                    startValue: 1, endValue: 0, duration,
                    onChange(value) { object.set("opacity", value); canvas.requestRenderAll(); },
                    onComplete() { object.set("opacity", 0); canvas.requestRenderAll(); onComplete?.(); }
                });
                break;
        }
    },

    playEmphasis({ animation, object, canvas, onComplete }) {
        const effect = (animation.type || "").toLowerCase();
        const duration = (animation.duration || 0.5) * 1000;

        switch (effect) {
            case "spin":
                {
                    const origAngle = object.angle || 0;
                    fabric.util.animate({
                        startValue: origAngle, endValue: origAngle + 360, duration,
                        onChange(value) { object.set("angle", value); canvas.requestRenderAll(); },
                        onComplete() { object.set("angle", origAngle); canvas.requestRenderAll(); onComplete?.(); }
                    });
                }
                break;
            
            case "pulse":
            case "grow-shrink":
                {
                    const origScaleX = object.scaleX || 1;
                    const origScaleY = object.scaleY || 1;
                    fabric.util.animate({
                        startValue: 1, endValue: 1.2, duration: duration / 2,
                        onChange(value) { 
                            object.set({ scaleX: origScaleX * value, scaleY: origScaleY * value }); 
                            canvas.requestRenderAll(); 
                        },
                        onComplete() { 
                            fabric.util.animate({
                                startValue: 1.2, endValue: 1, duration: duration / 2,
                                onChange(value) { 
                                    object.set({ scaleX: origScaleX * value, scaleY: origScaleY * value }); 
                                    canvas.requestRenderAll(); 
                                },
                                onComplete() {
                                    object.set({ scaleX: origScaleX, scaleY: origScaleY });
                                    canvas.requestRenderAll(); 
                                    onComplete?.();
                                }
                            });
                        }
                    });
                }
                break;

            case "blink":
            case "flash-once":
            case "flicker":
                {
                    fabric.util.animate({
                        startValue: 0, endValue: 1, duration,
                        onChange(value) { 
                            // Sin wave for blink effect
                            object.set("opacity", Math.abs(Math.cos(value * Math.PI * 4))); 
                            canvas.requestRenderAll(); 
                        },
                        onComplete() { object.set("opacity", 1); canvas.requestRenderAll(); onComplete?.(); }
                    });
                }
                break;

            default:
                // Fallback for emphasis is a little pulse
                {
                    const fallbackScaleX = object.scaleX || 1;
                    const fallbackScaleY = object.scaleY || 1;
                    fabric.util.animate({
                        startValue: 1, endValue: 1.1, duration: duration / 2,
                        onChange(value) { 
                            object.set({ scaleX: fallbackScaleX * value, scaleY: fallbackScaleY * value }); 
                            canvas.requestRenderAll(); 
                        },
                        onComplete() { 
                            fabric.util.animate({
                                startValue: 1.1, endValue: 1, duration: duration / 2,
                                onChange(value) { 
                                    object.set({ scaleX: fallbackScaleX * value, scaleY: fallbackScaleY * value }); 
                                    canvas.requestRenderAll(); 
                                },
                                onComplete() {
                                    object.set({ scaleX: fallbackScaleX, scaleY: fallbackScaleY });
                                    canvas.requestRenderAll(); 
                                    onComplete?.();
                                }
                            });
                        }
                    });
                }
                break;
        }
    },

    playFly({ animation, object, canvas, onComplete }) {
        const duration = (animation.duration || 0.5) * 1000;
        const direction = animation.effect || "from-left";

        const originalLeft = object.left;
        const originalTop = object.top;

        let startLeft = originalLeft;
        let startTop = originalTop;

        switch (direction) {
            case "from-right": startLeft = originalLeft + 300; break;
            case "from-top": startTop = originalTop - 300; break;
            case "from-bottom": startTop = originalTop + 300; break;
            default: startLeft = originalLeft - 300;
        }

        object.set({ left: startLeft, top: startTop, opacity: 1 });
        canvas.requestRenderAll();

        fabric.util.animate({
            startValue: 0, endValue: 1, duration,
            onChange(value) {
                object.set({
                    left: startLeft + (originalLeft - startLeft) * value,
                    top: startTop + (originalTop - startTop) * value
                });
                canvas.requestRenderAll();
            },
            onComplete() {
                object.set({ left: originalLeft, top: originalTop });
                canvas.requestRenderAll();
                onComplete?.();
            }
        });
    }

};

export default AnimationEngine;