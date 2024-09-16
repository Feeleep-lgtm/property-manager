import * as agentController from "./agentServices.js";
export const getAllAgents = async (req, res) => {
  try {
    const agents = await agentController.getAllAgents();
    res.status(200).json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res
      .status(500)
      .json({ message: "Error fetching agents", error: error.message });
  }
};

export const getOneAgent = async (req, res) => {
  const { id } = req.params;
  try {
    const agent = await agentController.getAgentById(id);
    res.status(200).json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res
      .status(500)
      .json({ message: "Error fetching agent", error: error.message });
  }
};

export const getAllAgentProperties = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Fetching properties for agent with id:", id); // Debug statement
    const properties = await agentController.getPropertiesByAgentId(id);
    if (!properties.length) {
      return res
        .status(404)
        .json({ message: "No properties found for this agent" });
    }
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching agent properties:", error);
    res.status(500).json({
      message: "Error fetching agent properties",
      error: error.message,
    });
  }
};

export const getOneAgentProperty = async (req, res) => {
  const { agentId, propertyId } = req.params;
  try {
    console.log(
      "Fetching property for agent with id:",
      agentId,
      "and property id:",
      propertyId
    ); // Debug statement
    const property = await agentController.getPropertyByAgentAndId(
      agentId,
      propertyId
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching agent property:", error);
    res
      .status(500)
      .json({ message: "Error fetching agent property", error: error.message });
  }
};
