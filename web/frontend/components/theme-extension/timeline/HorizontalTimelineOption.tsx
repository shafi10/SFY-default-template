import { Input } from "../../commonUI/Input";

interface HorizontalTimelineOptionProps {
  checked: boolean;
  onChange: (value: string) => void;
}

export default function HorizontalTimelineOption({
  checked,
  onChange,
}: HorizontalTimelineOptionProps) {
  return (
    <label data-timeline-card="true" data-selected={checked}>
      <s-grid>
        <s-box padding="base" border-radius="base">
          <s-stack direction="block" gap="small-300">
            <s-stack direction="inline" gap="small-300" inline-align="center">
              <Input
                type="radio"
                name="timeline"
                value="horizontal"
                checked={checked}
                onChange={onChange}
              />
              <s-text type="strong">Horizontal</s-text>
            </s-stack>

            {/* Horizontal Visual */}
            <div style={{ padding: "20px 0" }}>
              <s-stack
                direction="inline"
                gap="none"
                inline-align="start"
                justifyContent="center"
              >
                {/* Item 1 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#2C6ECB",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "4px",
                      height: "24px",
                      background: "#E3E3E3",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>
                {/* Connector */}
                <div
                  style={{
                    width: "24px",
                    height: "2px",
                    background: "#E3E3E3",
                    marginTop: "4px",
                  }}
                ></div>

                {/* Item 2 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#00A0AC",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "4px",
                      height: "24px",
                      background: "#E3E3E3",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>
                {/* Connector */}
                <div
                  style={{
                    width: "24px",
                    height: "2px",
                    background: "#E3E3E3",
                    marginTop: "4px",
                  }}
                ></div>

                {/* Item 3 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#FFA500",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "4px",
                      height: "24px",
                      background: "#E3E3E3",
                      borderRadius: "2px",
                    }}
                  ></div>
                </div>
              </s-stack>
            </div>

            <s-text>Modern stepper with items arranged horizontally</s-text>
          </s-stack>
        </s-box>
      </s-grid>
    </label>
  );
}
