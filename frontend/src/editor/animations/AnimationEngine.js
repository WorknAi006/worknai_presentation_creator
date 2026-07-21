import * as fabric from "fabric";
const AnimationEngine = {

    play({
        animation,
        object,
        canvas,
        onComplete
    }) {

        if (!animation || !object || !canvas) {
            onComplete?.();
            return;
        }

        switch (animation.category) {

            case "entrance":
                this.playEntrance({
                    animation,
                    object,
                    canvas,
                    onComplete
                });
                break;

            case "exit":
                this.playExit({
                    animation,
                    object,
                    canvas,
                    onComplete
                });
                break;

            case "emphasis":
                this.playEmphasis({
                    animation,
                    object,
                    canvas,
                    onComplete
                });
                break;

            case "motion_path":
                this.playMotion({
                    animation,
                    object,
                    canvas,
                    onComplete
                });
                break;

            default:
                onComplete?.();
        }

    },

    playEntrance({
    animation,
    object,
    canvas,
    onComplete
}) {

    const effect = (animation.type || "").toLowerCase();

    switch (effect) {

        case "appear":
            this.playAppear({
                animation,
                object,
                canvas,
                onComplete
            });
            break;

        case "fade":
            this.playFade({
                animation,
                object,
                canvas,
                onComplete
            });
            break;

        case "fly":
        case "fly-in":
            this.playFly({
                animation,
                object,
                canvas,
                onComplete
            });
            break;

        default:
            onComplete?.();
    }

},

    playExit() {

    },

    playEmphasis() {

    },
    playAppear({
    object,
    canvas,
    onComplete
}) {

    object.set({
        opacity: 1
    });

    canvas.requestRenderAll();

    onComplete?.();

},

playFade({
    animation,
    object,
    canvas,
    onComplete
}) {

    const duration =
        (animation.duration || 0.5) * 1000;

    object.set({
        opacity: 0
    });

    canvas.requestRenderAll();

    fabric.util.animate({

        startValue: 0,

        endValue: 1,

        duration,

        onChange(value) {

            object.set("opacity", value);

            canvas.requestRenderAll();

        },

        onComplete() {

            object.set("opacity", 1);

            canvas.requestRenderAll();

            onComplete?.();

        }

    });

},

playFly() {

},

    playMotion() {

    }

};

export default AnimationEngine;