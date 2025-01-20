import { TReaderDocument } from "npm:@usewaypoint/email-builder";

/*
Required fields:
host_name
guest_name
date_time
meeting_type
start_time
end_time
duration
start_duration
meeting_url
dashboard_url
guest_email
*/

export const preMeetingHost: TReaderDocument = {
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
        "block-1733248868787",
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
        "text": "Pre-meeting notification",
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
          "Dear {{host_name}}, your meeting with <strong>{{guest_name}}</strong> is scheduled to take place in <strong>{{start_duration}}</strong> ({{date_time}}).",
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
              "block-1733249047143",
            ],
          },
          {
            "childrenIds": [
              "block-1733244993211",
              "block-1733245373300",
              "block-1733245430577",
              "block-1733245023984",
              "block-1733249063029",
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
  "block-1733248868787": {
    "type": "ColumnsContainer",
    "data": {
      "style": {
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
              "block-1733248875533",
            ],
          },
          {
            "childrenIds": [
              "block-1733248877544",
            ],
          },
          {
            "childrenIds": [],
          },
        ],
      },
    },
  },
  "block-1733248875533": {
    "type": "Button",
    "data": {
      "style": {
        "textAlign": "right",
        "padding": {
          "top": 16,
          "bottom": 16,
          "right": 24,
          "left": 24,
        },
      },
      "props": {
        "text": "Dashboard",
        "url": "{{dashboard_url}}",
      },
    },
  },
  "block-1733248877544": {
    "type": "Button",
    "data": {
      "style": {
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
  "block-1733249047143": {
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
        "text": "Guest email",
      },
    },
  },
  "block-1733249063029": {
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
        "text": "{{guest_email}}",
      },
    },
  },
};
