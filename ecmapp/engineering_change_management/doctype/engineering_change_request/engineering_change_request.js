// Copyright (c) 2024, John Longland and contributors
// For license information, please see license.txt

frappe.ui.form.on('Engineering Change Request', {
	refresh(frm) {
		// your code here
	},
	requested_by: function(frm) {
	   frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Employee',
				filters: {
					name: frm.doc.requested_by
				},
				fieldname: ['employee_name']
			},
			callback: function(response) {
				// Set the fetched sales order number to the job card doctype
				if (response.message) {
					frm.set_value('requested_by_name', response.message.employee_name);
				}
			}
		});
	},
	approved_by: function(frm) {
				frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Employee',
				filters: {
					name: frm.doc.approved_by
				},
				fieldname: ['employee_name']
			},
			callback: function(response) {
				// Set the fetched sales order number to the job card doctype
				if (response.message) {
					frm.set_value('approved_by_name', response.message.employee_name);
				}
			}
		});
	},	
	duration_man_hours: function(frm) {
		CalculateEstimatedLabourCost(frm);
	},
	cost_per_man_hour: function(frm) {
		CalculateEstimatedLabourCost(frm);
	},
	estimated_labour_cost: function(frm) {
		CalculateTotalEstimatedCost(frm);
	},
	estimated_material_cost: function(frm) {
		CalculateTotalEstimatedCost(frm);
	},
	estimated_services_cost: function(frm) {
		CalculateTotalEstimatedCost(frm);
	},
	other_estimated_cost: function(frm) {
		CalculateTotalEstimatedCost(frm);
	}
})

function CalculateEstimatedLabourCost(frm) {
	if((frm.doc.duration_man_hours) && (frm.doc.cost_per_man_hour)) {
		var costPerManHour = frm.doc.cost_per_man_hour;
		
		var durationInHours = frm.doc.duration_man_hours;
		var estimatedLabourCost = durationInHours * costPerManHour;
		
		frm.set_value('estimated_labour_cost', estimatedLabourCost);
	}
}

function CalculateTotalEstimatedCost(frm) {
	if((frm.doc.estimated_labour_cost >= 0) && (frm.doc.estimated_material_cost >= 0) && (frm.doc.estimated_services_cost >= 0) && (frm.doc.other_estimated_cost >= 0)) {
		var TotalCost = frm.doc.estimated_labour_cost + frm.doc.estimated_material_cost + frm.doc.estimated_services_cost + frm.doc.other_estimated_cost;
		frm.set_value('total_estimated_cost', TotalCost);
	}
}
