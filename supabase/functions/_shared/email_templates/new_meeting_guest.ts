import { TReaderDocument } from "npm:@usewaypoint/email-builder";

/*
Required fields:
host_name
guest_name
date
meeting_type
start_time
end_time
duration
meeting_url
*/

export const newMeetingGuest: TReaderDocument = {
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",
      "borderRadius": 0,
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-1733244451145",
        "block-1733244499055",
        "block-1733245468264",
        "block-1733244775025",
        "block-1733244800102",
        "block-1733244979771",
        "block-1733245697037",
        "block-1733245667192",
      ],
    },
  },
  "block-1733244451145": {
    "type": "Heading",
    "data": {
      "props": {
        "text": "My Free Hours",
        "level": "h1",
      },
      "style": {
        "color": "#FFFFFF",
        "backgroundColor": "#544b60",
        "textAlign": "center",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
    },
  },
  "block-1733244499055": {
    "type": "Heading",
    "data": {
      "props": {
        "text": "New meeting scheduled",
        "level": "h2",
      },
      "style": {
        "fontWeight": "bold",
        "textAlign": "center",
        "padding": {
          "top": 16,
          "bottom": 0,
          "right": 24,
          "left": 24,
        },
      },
    },
  },
  "block-1733244775025": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 8,
          "bottom": 8,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "markdown": true,
        "text":
          "Dear {{guest_name}}, your meeting has been scheduled with <strong>{{host_name}}</strong>, on <strong>{{date}}</strong>.",
      },
    },
  },
  "block-1733244800102": {
    "type": "Heading",
    "data": {
      "props": {
        "text": "Details",
        "level": "h3",
      },
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
    },
  },
  "block-1733244979771": {
    "type": "Container",
    "data": {
      "style": {
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "childrenIds": [
          "block-1733244981599",
        ],
      },
    },
  },
  "block-1733244981599": {
    "type": "ColumnsContainer",
    "data": {
      "style": {
        "backgroundColor": null,
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "columnsCount": 2,
        "columnsGap": 16,
        "columns": [
          {
            "childrenIds": [
              "block-1733244990782",
              "block-1733245371264",
              "block-1733245417272",
              "block-1733245021733",
              "block-1736614417878",
            ],
          },
          {
            "childrenIds": [
              "block-1733244993211",
              "block-1733245373300",
              "block-1733245430577",
              "block-1733245023984",
              "block-1736614431391",
            ],
          },
          {
            "childrenIds": [],
          },
        ],
      },
    },
  },
  "block-1733244990782": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "Meeting type",
      },
    },
  },
  "block-1733244993211": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{meeting_type}}",
      },
    },
  },
  "block-1733245021733": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 8,
        },
      },
      "props": {
        "text": "Duration",
      },
    },
  },
  "block-1733245023984": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{duration}}",
      },
    },
  },
  "block-1733245371264": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "Start",
      },
    },
  },
  "block-1733245373300": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{start_time}}",
      },
    },
  },
  "block-1733245417272": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "End",
      },
    },
  },
  "block-1733245430577": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{end_time}}",
      },
    },
  },
  "block-1733245468264": {
    "type": "Divider",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 0,
          "left": 0,
        },
      },
      "props": {
        "lineColor": "#bebac4",
      },
    },
  },
  "block-1733245647166": {
    "type": "Button",
    "data": {
      "style": {
        "textAlign": "center",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "fullWidth": false,
        "text": "Button",
        "url": "https://www.usewaypoint.com",
      },
    },
  },
  "block-1733245667192": {
    "type": "Button",
    "data": {
      "style": {
        "textAlign": "center",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "buttonBackgroundColor": "#c22237",
        "text": "Cancel meeting",
        "url": "{{meeting_url}}",
      },
    },
  },
  "block-1733245697037": {
    "type": "Divider",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 0,
          "left": 0,
        },
      },
      "props": {
        "lineColor": "#bebac4",
      },
    },
  },
  "block-1736614417878": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "Meeting url",
      },
    },
  },
  "block-1736614431391": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{online_url}}",
      },
    },
  },
};

/*
Required fields:
host_name
guest_name
date
meeting_type
start_time
end_time
duration
meeting_url
meeting_information
*/

export const newMeetingGuestInformation: TReaderDocument = {
  "root": {
    "type": "EmailLayout",
    "data": {
      "backdropColor": "#F5F5F5",
      "borderRadius": 0,
      "canvasColor": "#FFFFFF",
      "textColor": "#262626",
      "fontFamily": "MODERN_SANS",
      "childrenIds": [
        "block-1733244451145",
        "block-1733244499055",
        "block-1733245468264",
        "block-1733244775025",
        "block-1733245567536",
        "block-1733245577293",
        "block-1733244800102",
        "block-1733244979771",
        "block-1733245697037",
        "block-1733245667192",
      ],
    },
  },
  "block-1733244451145": {
    "type": "Heading",
    "data": {
      "props": {
        "text": "My Free Hours",
        "level": "h1",
      },
      "style": {
        "color": "#FFFFFF",
        "backgroundColor": "#544b60",
        "textAlign": "center",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
    },
  },
  "block-1733244499055": {
    "type": "Heading",
    "data": {
      "props": {
        "text": "New meeting scheduled",
        "level": "h2",
      },
      "style": {
        "fontWeight": "bold",
        "textAlign": "center",
        "padding": {
          "top": 16,
          "bottom": 0,
          "right": 24,
          "left": 24,
        },
      },
    },
  },
  "block-1733244775025": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 8,
          "bottom": 8,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "markdown": true,
        "text":
          "Dear {{guest_name}}, your meeting has been scheduled with <strong>{{host_name}}</strong>, on <strong>{{date}}</strong>.",
      },
    },
  },
  "block-1733244800102": {
    "type": "Heading",
    "data": {
      "props": {
        "text": "Details",
        "level": "h3",
      },
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
    },
  },
  "block-1733244979771": {
    "type": "Container",
    "data": {
      "style": {
        "padding": {
          "top": 0,
          "bottom": 0,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "childrenIds": [
          "block-1733244981599",
        ],
      },
    },
  },
  "block-1733244981599": {
    "type": "ColumnsContainer",
    "data": {
      "style": {
        "backgroundColor": null,
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "columnsCount": 2,
        "columnsGap": 16,
        "columns": [
          {
            "childrenIds": [
              "block-1733244990782",
              "block-1733245371264",
              "block-1733245417272",
              "block-1733245021733",
              "block-1736614334000",
            ],
          },
          {
            "childrenIds": [
              "block-1733244993211",
              "block-1733245373300",
              "block-1733245430577",
              "block-1733245023984",
              "block-1736614351614",
            ],
          },
          {
            "childrenIds": [],
          },
        ],
      },
    },
  },
  "block-1733244990782": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "Meeting type",
      },
    },
  },
  "block-1733244993211": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{meeting_type}}",
      },
    },
  },
  "block-1733245021733": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 8,
        },
      },
      "props": {
        "text": "Duration",
      },
    },
  },
  "block-1733245023984": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{duration}}",
      },
    },
  },
  "block-1733245371264": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "Start",
      },
    },
  },
  "block-1733245373300": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{start_time}}",
      },
    },
  },
  "block-1733245417272": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "End",
      },
    },
  },
  "block-1733245430577": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{end_time}}",
      },
    },
  },
  "block-1733245468264": {
    "type": "Divider",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 0,
          "left": 0,
        },
      },
      "props": {
        "lineColor": "#bebac4",
      },
    },
  },
  "block-1733245567536": {
    "type": "Heading",
    "data": {
      "props": {
        "text": "Meeting information",
        "level": "h3",
      },
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
    },
  },
  "block-1733245577293": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "text": "{{meeting_information}}",
      },
    },
  },
  "block-1733245647166": {
    "type": "Button",
    "data": {
      "style": {
        "textAlign": "center",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "fullWidth": false,
        "text": "Button",
        "url": "https://www.usewaypoint.com",
      },
    },
  },
  "block-1733245667192": {
    "type": "Button",
    "data": {
      "style": {
        "textAlign": "center",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "buttonBackgroundColor": "#c22237",
        "text": "Cancel meeting",
        "url": "{{meeting_url}}",
      },
    },
  },
  "block-1733245697037": {
    "type": "Divider",
    "data": {
      "style": {
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 0,
          "left": 0,
        },
      },
      "props": {
        "lineColor": "#bebac4",
      },
    },
  },
  "block-1736614334000": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "bold",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "Meeting url",
      },
    },
  },
  "block-1736614351614": {
    "type": "Text",
    "data": {
      "style": {
        "fontWeight": "normal",
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 8,
          "left": 8,
        },
      },
      "props": {
        "text": "{{online_url}}",
      },
    },
  },
};
