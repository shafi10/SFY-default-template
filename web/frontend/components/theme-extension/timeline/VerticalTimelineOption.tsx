import { Input } from "../../commonUI/Input";

interface VerticalTimelineOptionProps {
  checked: boolean;
  onChange: (value: string) => void;
}

export default function VerticalTimelineOption({
  checked,
  onChange,
}: VerticalTimelineOptionProps) {
  return (
    <label data-timeline-card="true" data-selected={checked}>
      <s-grid>
        <s-box padding="base" border-radius="base">
          <s-stack direction="block" gap="small-200">
            <s-stack direction="inline" gap="small-300" inline-align="center">
              <Input
                type="radio"
                name="timeline"
                value="vertical"
                checked={checked}
                onChange={onChange}
              />
              <s-text type="strong">Vertical</s-text>
            </s-stack>

            {/* Vertical Visual */}
            <div style={{ padding: "8px 0 8px 6px" }}>
              <s-stack direction="block" gap="none">
                {/* Item 1 */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#2C6ECB",
                        flexShrink: 0,
                      }}
                    ></div>
                    <div
                      style={{
                        width: "2px",
                        height: "14px",
                        background: "#E3E3E3",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      width: "60px",
                      height: "6px",
                      background: "#E3E3E3",
                      borderRadius: "3px",
                      marginTop: "2px",
                    }}
                  ></div>
                </div>
                {/* Item 2 */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#00A0AC",
                        flexShrink: 0,
                      }}
                    ></div>
                    <div
                      style={{
                        width: "2px",
                        height: "14px",
                        background: "#E3E3E3",
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      width: "60px",
                      height: "6px",
                      background: "#E3E3E3",
                      borderRadius: "3px",
                      marginTop: "2px",
                    }}
                  ></div>
                </div>
                {/* Item 3 */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#FFA500",
                        flexShrink: 0,
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      width: "60px",
                      height: "6px",
                      background: "#E3E3E3",
                      borderRadius: "3px",
                      marginTop: "2px",
                    }}
                  ></div>
                </div>
              </s-stack>
            </div>

            <s-text>Traditional timeline with items stacked vertically</s-text>
          </s-stack>
        </s-box>
      </s-grid>
    </label>
  );
}
