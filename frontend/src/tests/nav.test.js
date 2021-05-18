import { render } from "@testing-library/react";
import { Navbar } from "../components/Navbar";
import * as Contexto from "../Context"
import * as ContextoUI from "../ContextUI"

describe("Navbar", () => {
    it("renders correctly", () => {
        const contextvals = { state: "koko" }
        jest
            .spyOn(Contexto, "useDataLayer")
            .mockImplementation(() => contextvals)

        const contextvalsUI = { sidebarOpen: true }
        jest
            .spyOn(ContextoUI, "useUILayer")
            .mockImplementation(() => contextvalsUI)
        
        const history = createMemoryHis

        const { getByTestId } = render(<Navbar />)
        expect(getByTestId("navbar")).toBeTruthy()
    })
})