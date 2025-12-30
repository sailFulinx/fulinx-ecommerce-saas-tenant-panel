// 组件类型分类
export const componentCategories: ComponentStructure[] = [
  {
    type: 'media',
    name: '媒体组件',
    components: [
      {
        type: 'image',
        name: '图片',
        icon: 'material-symbols:image-outline-rounded',
        styles: [
          {
            name: '单图-图片样式1',
            panelComponentCode: 'CommonImageText',
            webComponentCode: 'WebCommonImageText',
            thumbFileUrl: '/static/images/common/image-text-1.png',
          },
          {
            name: '多图-图片样式1',
            panelComponentCode: 'CommonMultiImageText',
            webComponentCode: 'CommonMultiImageText',
            thumbFileUrl: '/static/images/common/multi-image-text.png',
          },
          {
            name: '视频-视频样式1',
            panelComponentCode: 'CommonVideo',
            webComponentCode: 'CommonVideo',
            thumbFileUrl: '/static/images/common/video.png',
          },
          {
            name: '多文件样式',
            panelComponentCode: 'CommonFile',
            webComponentCode: 'CommonFile',
            thumbFileUrl: '/static/images/common/file.png',
          },
          {
            name: '轮播图样式',
            panelComponentCode: 'CommonCarousel',
            webComponentCode: 'CommonCarousel',
            thumbFileUrl: '/static/images/common/carousel.png',
          },
        ],
      },
    ],
  },
  {
    type: 'text',
    name: '文本组件',
    components: [
      {
        type: 'text',
        name: '文字',
        icon: 'ant-design:file-text-outlined',
        styles: [
          {
            name: '文字样式',
            panelComponentCode: 'CommonText',
            webComponentCode: 'CommonText',
            thumbFileUrl: '/static/images/common/text.png',
          },
          {
            name: '文字组样式',
            panelComponentCode: 'CommonTextGroup',
            webComponentCode: 'CommonTextGroup',
            thumbFileUrl: '/static/images/common/text-group.png',
          },
          {
            name: '编辑器样式',
            panelComponentCode: 'CommonEditor',
            webComponentCode: 'CommonEditor',
            thumbFileUrl: '/static/images/common/editor.png',
          },
        ],
      },
    ],
  },
  {
    type: 'interactive',
    name: '交互组件',
    components: [
      {
        type: 'button',
        name: '按钮',
        icon: 'proicons:button',
        styles: [
          {
            name: '按钮样式',
            panelComponentCode: 'CommonButton',
            webComponentCode: 'CommonButton',
            thumbFileUrl: '/static/images/common/button.png',
          },
          {
            name: '多按钮样式',
            panelComponentCode: 'CommonButtonGroup',
            webComponentCode: 'CommonButtonGroup',
            thumbFileUrl: '/static/images/common/button-group.png',
          },
        ],
      },
      {
        type: 'form',
        name: '预约表单',
        icon: 'ant-design:form-outlined',
        styles: [
          {
            name: '预约表单样式',
            panelComponentCode: 'CommonMessage',
            webComponentCode: 'CommonMessage',
            thumbFileUrl: '/static/images/common/form.png',
          },
        ],
      },
      {
        type: 'readContent',
        name: '内容读取',
        icon: 'fluent:slide-content-24-regular',
        styles: [
          {
            name: '内容读取样式',
            panelComponentCode: 'CommonReadContent',
            webComponentCode: 'CommonReadContent',
            thumbFileUrl: '/static/images/common/read-content.png',
          },
        ],
      },
      {
        type: 'faq',
        name: 'FAQ',
        icon: 'streamline-ultimate:contact-us-faq',
        styles: [
          {
            name: 'FAQ样式',
            panelComponentCode: 'CommonFaq',
            webComponentCode: 'CommonFaq',
            thumbFileUrl: '/static/images/common/faq.png',
          },
        ],
      },
      {
        type: 'login',
        name: '登录',
        icon: 'ant-design:environment-outlined',
        styles: [
          {
            name: '登录样式',
            panelComponentCode: 'CommonLogin',
            webComponentCode: 'CommonLogin',
            thumbFileUrl: '/static/images/common/login.png',
          },
        ],
      },
      {
        type: 'register',
        name: '注册',
        icon: 'ant-design:share-alt-outlined',
        styles: [
          {
            name: '注册样式',
            panelComponentCode: 'CommonRegister',
            webComponentCode: 'CommonRegister',
            thumbFileUrl: '/static/images/common/register.png',
          },
        ],
      },
      {
        type: 'forgetPassword',
        name: '忘记密码',
        icon: 'ant-design:share-alt-outlined',
        styles: [
          {
            name: '忘记密码样式',
            panelComponentCode: 'CommonForgetPassword',
            webComponentCode: 'CommonForgetPassword',
            thumbFileUrl: '/static/images/common/forget-password.png',
          },
        ],
      },
    ],
  },
  {
    type: 'navigation',
    name: '导航组件',
    components: [
      {
        type: 'menu',
        name: '菜单',
        icon: 'ant-design:menu-outlined',
        styles: [
          {
            name: '菜单样式',
            panelComponentCode: 'CommonMenu',
            webComponentCode: 'CommonMenu',
            thumbFileUrl: '/static/images/common/menu.png',
          },
        ],
      },
      {
        type: 'breadcrumb',
        name: '面包屑',
        icon: 'ant-design:right-outlined',
        styles: [
          {
            name: '面包屑样式',
            panelComponentCode: 'CommonBreadcrumb',
            webComponentCode: 'CommonBreadcrumb',
            thumbFileUrl: '/static/images/common/breadcrumb.png',
          },
        ],
      },
    ],
  },
  {
    type: 'data',
    name: '数据展示组件',
    components: [
      {
        type: 'table',
        name: '表格',
        icon: 'table',
        styles: [
          {
            name: '表格样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/table.png',
          },
        ],
      },
      {
        type: 'list',
        name: '列表',
        icon: 'ordered-list',
        styles: [
          {
            name: '列表样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/list.png',
          },
        ],
      },
      {
        type: 'card',
        name: '卡片',
        icon: 'credit-card',
        styles: [
          {
            name: '卡片样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/card.png',
          },
        ],
      },
      {
        type: 'statistic',
        name: '统计数值',
        icon: 'bar-chart',
        styles: [
          {
            name: '统计数值样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/statistic.png',
          },
        ],
      },
      {
        type: 'progress',
        name: '进度条',
        icon: 'loading',
        styles: [
          {
            name: '进度条样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/progress.png',
          },
        ],
      },
    ],
  },
  {
    type: 'feedback',
    name: '反馈组件',
    components: [
      {
        type: 'alert',
        name: '警告提示',
        icon: 'exclamation-circle',
        styles: [
          {
            name: '警告提示样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/alert.png',
          },
        ],
      },
      {
        type: 'modal',
        name: '对话框',
        icon: 'fullscreen',
        styles: [
          {
            name: '对话框样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/modal.png',
          },
        ],
      },
      {
        type: 'message',
        name: '全局提示',
        icon: 'message',
        styles: [
          {
            name: '全局提示样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/message.png',
          },
        ],
      },
      {
        type: 'notification',
        name: '通知提醒',
        icon: 'bell',
        styles: [
          {
            name: '通知提醒样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/notification.png',
          },
        ],
      },
      {
        type: 'popover',
        name: '气泡卡片',
        icon: 'info-circle',
        styles: [
          {
            name: '气泡卡片样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/popover.png',
          },
        ],
      },
    ],
  },
  {
    type: 'layout',
    name: '布局组件',
    components: [
      {
        type: 'divider',
        name: '分割线',
        icon: 'minus',
        styles: [
          {
            name: '分割线样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/divider.png',
          },
        ],
      },
      {
        type: 'grid',
        name: '栅格',
        icon: 'border-horizontal',
        styles: [
          {
            name: '栅格样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/grid.png',
          },
        ],
      },
      {
        type: 'space',
        name: '间距',
        icon: 'column-width',
        styles: [
          {
            name: '间距样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/space.png',
          },
        ],
      },
      {
        type: 'layout',
        name: '布局',
        icon: 'layout',
        styles: [
          {
            name: '布局样式',
            panelComponentCode: 'CommonImage',
            webComponentCode: 'CommonImage',
            thumbFileUrl: '/static/images/common/layout.png',
          },
        ],
      },
    ],
  },
]
