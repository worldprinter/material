import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMClient from 'react-dom/client';
import './index.css';

import {
  DEFAULT_PLUGIN_LIST,
  EnginContext,
  Engine,
  LayoutPropsType,
  collectVariable,
  flatObject,
} from '@worldprinter/lowcode-engine';
import * as CRender from '@worldprinter/lowcode-render';

const win = window as any;
win.React = React;
win.ReactDOM = ReactDOM;
win.ReactDOMClient = ReactDOMClient;

const beforeInitRender: LayoutPropsType['beforeInitRender'] = async ({
  iframe,
}) => {
  const subWin = iframe.getWindow() as any;
  if (!subWin) {
    return;
  }

  subWin.React = React;

  subWin.ReactDOM = ReactDOM;
  subWin.ReactDOMClient = ReactDOMClient;
};

const customRender: LayoutPropsType['customRender'] = async ({
  iframe: iframeContainer,
  assets,
  page,
  pageModel,
  ready,
}) => {
  // await iframeContainer.injectJS('http://localhost:4173/index.umd.js');
  const iframeWindow = iframeContainer.getWindow()!;
  const iframeDoc = iframeContainer.getDocument()!;
  const IframeReact = iframeWindow.React!;
  const IframeReactDOM = iframeWindow.ReactDOMClient!;
  // const CRender = iframeWindow.CRender!;

  // 注入组件物料资源
  const assetLoader = new CRender.AssetLoader(assets, {
    window: iframeContainer.getWindow()!,
  });
  assetLoader
    .onSuccess(() => {
      // 从子窗口获取物料对象
      const componentCollection = collectVariable(assets, iframeWindow);
      const components = flatObject(componentCollection);

      const App = IframeReact?.createElement(CRender.DesignRender, {
        adapter: CRender?.ReactAdapter,
        page: page,
        pageModel: pageModel,
        components,
        onMount: (designRenderInstance) => {
          ready(designRenderInstance);
        },
      });

      IframeReactDOM.createRoot(iframeDoc.getElementById('app')!).render(App);
    })
    .onError(() => {
      console.log('资源加载出粗');
    })
    .load();
};
export const Editor = () => {
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState({
    version: '1.0.0',
    name: 'BaseDemoPage',
    componentsMeta: [],
    componentsTree: {
      componentName: 'RootContainer',
      props: {
        a: 1,
      },
      state: {
        b: 2,
        buttonVisible: true,
        modalVisible: false,
      },
      configure: {
        propsSetter: {},
        advanceSetter: {},
      },
      children: [],
    },
    assets: [],
  });

  useEffect(() => {
    const localPage = localStorage.getItem('pageSchema');
    if (localPage) {
      setPage(JSON.parse(localPage));
    }
    setReady(true);
  }, []);
  const onReady = useCallback(async (ctx: EnginContext) => {
    const designer = await ctx.pluginManager.onPluginReadyOk('Designer');
    const reloadPage = async () => {
      setTimeout(() => {
        const designerExports = designer?.exports as any;
        console.log('to reload');
        designerExports.reload();
      }, 0);
    };

    const workbench = ctx.engine.getWorkbench();

    workbench?.replaceTopBarView(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '10px',
        }}
      ></div>
    );
  }, []);

  if (!ready) {
    return <>loading...</>;
  }

  return (
    <Engine
      plugins={DEFAULT_PLUGIN_LIST}
      schema={page as any}
      // 传入组件物料
      material={[]}
      // 组件物料对应的 js 运行库，只能使用 umd 模式的 js
      assetPackagesList={[]}
      beforePluginRun={({ pluginManager }) => {
        pluginManager.customPlugin('Designer', (pluginInstance) => {
          pluginInstance.ctx.config.beforeInitRender = beforeInitRender;
          pluginInstance.ctx.config.customRender = customRender;
          return pluginInstance;
        });
      }}
      onReady={onReady}
    />
  );
};