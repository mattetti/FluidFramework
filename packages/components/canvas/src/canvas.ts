/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { PrimedComponent } from "@prague/aqueduct";
import { controls, ui } from "@prague/client-ui";
import {
    IComponentHandle,
    IComponentHTMLOptions,
    IComponentHTMLView,
    IComponentHTMLVisual,
} from "@prague/component-core-interfaces";
import { ISharedMap } from "@prague/map";
import { IComponentRuntime } from "@prague/runtime-definitions";
import { IStream, Stream } from "@prague/stream";
import "./style.less";

// tslint:disable:no-console
class CanvasView implements IComponentHTMLView {

    public get IComponentHTMLView() { return this; }

    public static create(
        runtime: IComponentRuntime,
        root: ISharedMap,
        ink: IStream,
    ): CanvasView {
        const browserHost = new ui.BrowserContainerHost();
        const canvas = new controls.FlexView(
            document.createElement("div"),
            ink);
        browserHost.attach(canvas);

        return new CanvasView();
    }

    public render(elm: HTMLElement, options?: IComponentHTMLOptions): void {
        // TODO
        return;
    }

    public remove(): void {
        // TODO need way to detach rendering
        return;
    }
}

export class Canvas extends PrimedComponent implements IComponentHTMLVisual {
    public get IComponentHTMLVisual() { return this; }

    private ink: IStream;

    public render(elm: HTMLElement, options?: IComponentHTMLOptions): void {
        CanvasView.create(this.runtime, this.root, this.ink).render(elm, options);
    }

    protected async componentInitializingFirstTime() {
        this.root.set("pageInk", Stream.create(this.runtime).handle);
    }

    protected async componentHasInitialized() {
        // Wait here for the ink - otherwise flexView will try to root.get it before it exists if there hasn't been
        // a summary op yet.  Probably flexView should wait instead.
        const handle = await this.root.wait<IComponentHandle>("pageInk");
        this.ink = await handle.get<IStream>();
    }
}