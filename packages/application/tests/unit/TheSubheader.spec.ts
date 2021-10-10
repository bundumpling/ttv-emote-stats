import { mount } from "@vue/test-utils";
import TheSubheader from "@/components/TheSubheader.vue";

describe("TheSubheader", () => {
  it("should display header text", () => {
    const msg = "I Am Some Subheader Text";
    const wrapper = mount(TheSubheader, { props: { msg } });

    expect(wrapper.find("h2").text()).toEqual(msg);
  });
});
