// Copyright (c) 2024, John Longland and contributors
// For license information, please see license.txt

frappe.ui.form.on('Engineering Change Request', {
	refresh(frm) {
		// your code here
		// add custom button after first save
		if (!frm.doc.__islocal && frm.doc.item_changed) {
			frm.add_custom_button('Get Related Sales Orders', function() {
				// route to list-view of Sales Orders
				if (frm.doc.item_changed) {
					frappe.route_options = {"item_code": frm.doc.item_changed};
					frappe.set_route('List','Sales Order');
				}
			}).addClass('btn-primary');
		}
	},
	// fetch requestor employee name
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
				if (response.message) {
					frm.set_value('requested_by_name', response.message.employee_name);
					frm.refresh_field('requested_by_name');
				}
			}
		});
	},
	// fetch approval employee name
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
				if (response.message) {
					frm.set_value('approved_by_name', response.message.employee_name);
					frm.refresh_field('approved_by_name');
				}
			}
		});
                // fetch current date for approval_date
                let current_date = frappe.datetime.nowdate();
                frm.set_value('approval_date', current_date);
                frm.refresh_field('approval_date');

	},
	// fetch BOM
	item_changed: function(frm){
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Item',
				filters: {
					item_code: frm.doc.item_changed
				},
				fieldname: ['default_bom']
			},
			callback: function(response) {
				if (response.message) {
					frm.set_value('default_bom', response.message.default_bom);
					frm.refresh_field('default_bom');
				}
			}
		});
	},


	// fetch project name
	project_name: function(frm) {
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Project',
				filters: {
					name: frm.doc.project_name
				},
				fieldname: ['project_name']
			},
			callback: function(response) {
				if (response.message) {
					frm.set_value('name_of_project', response.message.project_name);
					frm.refresh_field('name_of_project');
				}
			}
		});
	},

	// field-triggers to call calculation functions
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

// Calculation functions
function CalculateEstimatedLabourCost(frm) {
	if((frm.doc.duration_man_hours >= 0) && (frm.doc.cost_per_man_hour >= 0)) {
		var costPerManHour = frm.doc.cost_per_man_hour;
		
		var durationInHours = frm.doc.duration_man_hours;
		var estimatedLabourCost = durationInHours * costPerManHour;
		
		frm.set_value('estimated_labour_cost', estimatedLabourCost);
		frm.refresh_field('estimated_labour_cost');
	}
}

function CalculateTotalEstimatedCost(frm) {
	if((frm.doc.estimated_labour_cost >= 0) && (frm.doc.estimated_material_cost >= 0) && (frm.doc.estimated_services_cost >= 0) && (frm.doc.other_estimated_cost >= 0)) {
		var TotalCost = frm.doc.estimated_labour_cost + frm.doc.estimated_material_cost + frm.doc.estimated_services_cost + frm.doc.other_estimated_cost;
		frm.set_value('total_estimated_cost', TotalCost);
	}
}


// table triggers
frappe.ui.form.on('Selected Items', {
	old_item: function(frm,cdt,cdn) {
		var row=locals[cdt][cdn];
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Item',
				filters: {
					"item_code": row.old_item
				},
				fieldname: 'item_name'
			},
			callback: function(r) {
				if (r.message) {
					frappe.model.set_value(cdt, cdn, 'old_item_name', r.message.item_name);
				}
			}
		});
	},
	new_item: function(frm,cdt,cdn) {
		var row=locals[cdt][cdn];
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Item',
				filters: {
					"item_code": row.new_item
				},
				fieldname: 'item_name'
			},
			callback: function(r) {
				if (r.message) {
					frappe.model.set_value(cdt, cdn, 'new_item_name', r.message.item_name);
				}
			}
		});
	}
});
