import {AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild} from '@angular/core';
import {ImgCropperConfig, ImgCropperErrorEvent, ImgCropperEvent, LyImageCropper} from '@alyle/ui/image-cropper';
import {LY_DIALOG_DATA, LyDialogRef} from '@alyle/ui/dialog';
import {lyl, StyleRenderer, ThemeRef, ThemeVariables} from '@alyle/ui';
import { STYLES as SLIDER_STYLES } from '@alyle/ui/slider';

const STYLES = (_theme: ThemeVariables, ref: ThemeRef) => {
    ref.renderStyleSheet(SLIDER_STYLES);
    const slider = ref.selectorsOf(SLIDER_STYLES);
    return {
        cropper: lyl `{
      max-width: 320px
      height: 320px
    }`,
        sliderContainer: lyl `{
      position: relative
      ${slider.root} {
        position: absolute
        left: 0
        right: 0
        margin: auto
        top: -32px
      }
    }`,
        slider: lyl `{
      padding: 1em
    }`
    };
};

@Component({
    templateUrl: './image-crop-modal.component.html',
    styleUrls: ['../../styles/root.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageCropModalComponent implements AfterViewInit {
    readonly classes = this.sRenderer.renderSheet(STYLES);
    title: string;

    scale: number;

    @ViewChild(LyImageCropper, { static: true }) cropper: LyImageCropper;
    myConfig: ImgCropperConfig = {
        width: 250, // Default `250`
        height: 250, // Default `200`
        type: 'image/png' // Or you can also use `image/jpeg`
    };

    constructor(
        @Inject(LY_DIALOG_DATA) private event: Event,
        readonly sRenderer: StyleRenderer,
        public dialogRef: LyDialogRef) {
    }

    ngAfterViewInit() {
        // Load image when dialog animation has finished
        this.dialogRef.afterOpened.subscribe(() => {
            this.cropper.selectInputEvent(this.event);
        });
    }


    submit() {
        this.dialogRef.close();
    }

}
